require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('debug', true);

//Connect to the database
const connect = (uri) => {
    mongoose.connect(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    })
    .then(res => console.log(`Connection to mongoDB successful`))
    .catch(err => { 
        console.log(`Error in DB connection`);
        console.error(err);
        process.exit(1); // Exit the process if the connection fails
    });
}

// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// const run = async (uri) => {
//     try {
//         // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//         await mongoose.connect(uri, clientOptions);
//         await mongoose.connection.db.RFID().command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");

//     } catch (error) {
//         console.error("Error connecting to MongoDB: ", error);
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await mongoose.disconnect();
//     }
// }
// run().catch(console.dir);



module.exports = () => connect(process.env.MONGO_URI);