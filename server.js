const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require('./middleware/error');
const connectDB = require("./config/db");
//load env vars
dotenv.config({ path: "./config/config.env" });

//connection to the database
connectDB();

//Route files
const bootcamps = require("./routes/bootcamps.js");

const app = express();

//Body Parser
app.use(express.json());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Mount the routers
app.use("/api/v1/bootcamps", bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} node on port ${PORT}`.yellow.bold
  )
);

//Handle unhandle promise rejections
process.on("unhandledRejection", (err, Promise) => {
  console.log(`Error:${err.message}`);
  //Close server and exit process
  server.close(() => {
    process.exit(1);
  });
});
