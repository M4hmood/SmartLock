require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./database/dbConnect");
const cardRoute = require("./routes/cardRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
//const { handleError } = require("./middlewares/handleError");


//connect to the datatbase
dbConnect();

//built-in middlewares
app.use(express.json());
app.use(cors());
//app.use(express.urlencoded({ extended: true }));

//Api routes
app.use("/Cards", cardRoute);
app.use("/Users", userRoute);
app.use("/Auth", authRoute);

//error handling middleware
//app.use(handleError);

//server
const listener = app.listen(process.env.PORT || 3001, () => {
    console.log(`App running on port ${listener.address().port}`);
});