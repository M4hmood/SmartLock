const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI);

async function createDatabase() {
    try {
        // Connect to MongoDB server
        await client.connect();
        console.log("Connected to MongoDB!");

        // Specify the database name
        const dbName = "RFID";
        const db = client.db(dbName);

        // Specify the collection name
        const collectionName = "Cards";
        const collection = db.collection(collectionName);

        // Insert a document into the collection
        const documents = [
            {
                uid: { HEX: "73 5F 3C AC", DEC: "115 95 60 172" },
                owner: "Mahmoud Boumaiza",
                authorized: true,
                accessLevel: "admin",
                issued: new Date(),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90) // 90 days from now
            },
            {
                uid: { HEX: "63 64 A0 AB", DEC: "99 100 160 171" },
                owner: "Yassine Boumaiza",
                authorized: true,
                accessLevel: "guest",
                issued: new Date(),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 70) // 70 days from now
            },
        ];
        const result = await collection.insert(documents);

        console.log(`${result.insertedCount} documents were inserted into the collection "${collectionName}" in the database "${dbName}".`);
        
    } catch (error) {
        console.error("Error occurred while creating database or collection:", error.message);
    } finally {
        // Close the connection
        await client.close();
        console.log("Connection closed.");
    }
}

createDatabase();
