#include <ESP8266WiFi.h>
#include <espnow.h>


#define Lock 4

typedef struct struct_message {
  bool authorized;
} struct_message;

struct_message receivedData;

void onReceive(uint8_t *mac, uint8_t *incomingData, uint8_t len) {
  memcpy(&receivedData, incomingData, sizeof(receivedData));
  Serial.println("Data received:");
  Serial.print("Access authorized: ");
  Serial.println(receivedData.authorized);
}

void setup() {
  Serial.begin(115200);

  // Initialize Wi-Fi in station mode
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();

  // Initialize ESP-NOW
  if (esp_now_init() != 0) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Register receive callback
  esp_now_set_self_role(ESP_NOW_ROLE_SLAVE);
  esp_now_register_recv_cb(onReceive);

  pinMode(Lock, OUTPUT);
}

void loop() {
  // Nothing to do in the loop
  if (receivedData.authorized) {
    digitalWrite(Lock, HIGH);
  } else{
    digitalWrite(Lock, LOW);
  }
}
