const mongoose = require("mongoose");
const colors = require("colors");
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("MongoDB is connected !");
  } catch (error) {
    console.log(`${error}`.bgRed);
  }
};

module.exports = connectDb;
