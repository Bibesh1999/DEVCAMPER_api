const path = require('path');
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require('express-fileupload');
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
//load env vars
dotenv.config({ path: "./config/config.env" });

//connection to the database
connectDB();

//Route files
const bootcamps = require("./routes/bootcamps.js");
const courses = require("./routes/courses.js");

const app = express();

//Body Parser
app.use(express.json());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Uploading files
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount the routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

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
