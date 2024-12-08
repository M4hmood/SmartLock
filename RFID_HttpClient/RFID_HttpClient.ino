#include <esp_now.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 5
#define RST_PIN 0
#define buzzer 12

// MAC Address of the ESP8266 receiver
uint8_t receiverMAC[] = {0xA4, 0xCF, 0x12, 0xFC, 0xA2, 0x04}; // Replace with the ESP8266 MAC address
 
MFRC522 rfid(SS_PIN, RST_PIN); // Instance of the class
MFRC522::MIFARE_Key key; 

// Init array that will store new NUID 
// byte nuidPICC[4];

// Replace with your network credentials
const char* ssid = "EL_DIRECTOR";
const char* password = "trypassword";

// Replace with your server's API endpoint
const char* serverUrl = "http://192.168.137.1:3000/Cards";

// Struct for ESP-NOW data
typedef struct struct_message {
  bool authorized;
} struct_message;

struct_message dataToSend;

void setup() { 
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi");

  SPI.begin(); // Init SPI bus
  rfid.PCD_Init(); // Init MFRC522 

  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }

  Serial.println(F("This code scan the MIFARE Classic NUID."));
  Serial.print(F("Using the following key:"));
  printHex(key.keyByte, MFRC522::MF_KEY_SIZE);

  pinMode(buzzer, OUTPUT);

  // Initialize ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Register send callback
  esp_now_register_send_cb(onSent);

  // Add receiver peer (ESP8266)
  esp_now_peer_info_t peerInfo;
  memcpy(peerInfo.peer_addr, receiverMAC, 6);
  peerInfo.channel = 0; // Same channel as the receiver
  peerInfo.encrypt = false;

  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Failed to add peer");
    return;
  }

}
 
void loop() {

  // Reset the loop if no new card present on the sensor/reader and Verify if the NUID has been readed. This saves the entire process when idle.
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial())
    return;

  Serial.println(F("A card has been detected."));
  Serial.print(F("The NUID tag is:"));
  Serial.println("HEX: ");
  printHex(rfid.uid.uidByte, rfid.uid.size);
  Serial.println("DEC: ");
  printDec(rfid.uid.uidByte, rfid.uid.size);
  Serial.println();

  String cardUid = getCardUid(rfid.uid.uidByte, rfid.uid.size);

  // Send the HTTP request
  sendHttpRequest(cardUid);

  // Halt PICC
  rfid.PICC_HaltA();
  
  // Stop encryption on PCD
  rfid.PCD_StopCrypto1();

}


// To indicate the Delivery status of data sent to the other board 
void onSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("Delivery Status: ");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Success" : "Fail");
}

// Helper routine to dump a byte array as hex values to Serial. 
void printHex(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
  }
  Serial.println();
}

// Helper routine to dump a byte array as dec values to Serial.
void printDec(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(' ');
    Serial.print(buffer[i], DEC);
  }
  Serial.println();
}

// Ring buzzer n times 
void ringBuzzer(int times, int duration) {
  for (int i = 0; i < times; i++) {
    digitalWrite(buzzer, HIGH);
    delay(duration);
    digitalWrite(buzzer, LOW);
  }
}

String getCardUid(byte *uid, byte size) {
  String cardUid = "";
  for (byte i = 0; i < size; i++) {
    if (uid[i] < 0x10) cardUid += "0";
    cardUid += String(uid[i], HEX);
  }
  return cardUid;
}

// Http request sender
void sendHttpRequest(String cardUid) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String fullUrl = String(serverUrl) + "/Hex/" + cardUid;

    http.begin(fullUrl);
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("[HTTP] GET... code: %d\n", httpResponseCode);

      // file found at server
      if (httpResponseCode == HTTP_CODE_OK || httpResponseCode == HTTP_CODE_MOVED_PERMANENTLY) {
        String payload = http.getString();

        // Parse the JSON payload
        StaticJsonDocument<200> doc;  // Adjust the size depending on your response
        DeserializationError error = deserializeJson(doc, payload);

        if (error) {
          Serial.println("Error parsing JSON");
          return;
        }

        // Access the "authorized" value from the parsed JSON
        bool authorized = doc["authorized"];

        if (authorized) {
          Serial.println("Card authorized!");
          ringBuzzer(1, 200);

          // Send data via ESP-NOW
          dataToSend.authorized = true;
          esp_err_t result = esp_now_send(receiverMAC, (uint8_t *)&dataToSend, sizeof(dataToSend));

          if (result == ESP_OK) {
            Serial.println("Data sent via ESP-NOW successfully");
          } else {
            Serial.println("Error sending data via ESP-NOW");
          }
        } else {
          Serial.println("Card not authorized!");
          ringBuzzer(2, 200);

          // Notify ESP8266 of unauthorized access
          dataToSend.authorized = false;
          esp_now_send(receiverMAC, (uint8_t *)&dataToSend, sizeof(dataToSend));
        }
      }
    } else {
      Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
    }
    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
}