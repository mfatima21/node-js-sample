import express from "express";
import session from "express-session";
// import bluebird from "bluebird";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
import path from "path";
import mongoose from "mongoose";
import { MONGODB_URI, SESSION_SECRET } from "./utils/secrets.utils";
import routes from "./routes/index.routes";
const BodyParser = require("body-parser");
// Load environment variables from .env file, where API keys and passwords are configured

// Create Express server
const app = express();
// Connect to MongoDB
dotenv.config({ path: ".env" });
// const MongoStore = MongoStore(session);
const mongoUrl = MONGODB_URI;
// (<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl).then(
  async () => {
    console.log("connected to database" + mongoUrl );
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    /* Dropping the test database in case of Test environment */
  },
).catch(err => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
});

// Express configuration
app.use(function (req, res, next) {
  res.header("Content-Type", "application/json");
  next();
});

app.set("port", process.env.PORT || 3000);

// app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  store: MongoStore.create({
    mongoUrl: mongoUrl,
  })
}));

// mount routes to /api path
app.use("/api", routes);

app.use(function (err: any, req: any, res: any, next: any) {
  console.log("Bad request ", err);
  const errorArray: any = [];
  const length = err.errors ? err.errors.length : 0;
  if (length > 0) {
    for (let i = 0; i < err.errors.length; i++) {
      err.errors[i].messages = JSON.stringify(err.errors[i].messages).replace(/[^, a-zA-Z0-9]/g, "");
      errorArray[i] = err.errors[i].messages;
    }
    res.status(400).json({
      message: "HttpStatus.BAD_REQUEST,",
      error: errorArray
    });
  } else {
    res.status(400).json({
      message: "HttpStatus.BAD_REQUEST",
      error: err
    });
  }
});

export default app;