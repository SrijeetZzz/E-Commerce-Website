const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log("Connected");
  } catch (error) {
    console.log(`Error : ${error}`);
  }
};


module.exports = connectDB;