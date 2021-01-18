const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Database connected...");
  } catch (err) {
    console.error(err.message);
    //  Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
