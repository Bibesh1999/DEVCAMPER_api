const mongoose = require("mongoose");
const dotenv = require('dotenv');
//load env vars
dotenv.config({ path: "./config/config.env" });


const connectDB = async () => {
  const conn = await mongoose.connect(
    process.env.DATABASE,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
  );
  console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
