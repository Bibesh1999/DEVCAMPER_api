const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
//load env vars
dotenv.config({ path: "./config/config.env" });

//connection to the database
connectDB();

//Route files
const bootcamps = require("./routes/bootcamps.js");
const courses = require("./routes/courses.js");
const auth = require("./routes/auth.js");
const users = require("./routes/users.js");
const reviews = require("./routes/reviews.js");

const app = express();

//Body Parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Uploading files
app.use(fileupload());

//sanitize data
app.use(mongoSanitize());

//Set Security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Defining rate limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 mins
  max: 100
});

app.use(limiter);

//Prevent http params pollution
app.use(hpp());

//Enavle CORS
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//Mount the routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

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
