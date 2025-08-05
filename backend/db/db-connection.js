const mongoose = require("mongoose");

mongoose
.connect(`${process.env.MONGODB_URI}/practice`)
.then(() => {console.log("Database connected")})
.catch((err) => {console.log(`Mongodb connection failed - ${process.env.MONGODB_URI}`)});

module.exports = mongoose.connection;