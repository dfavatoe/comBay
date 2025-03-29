import express from "express";
import colors from "colors";
import cors from "cors"; //http requests, get, post, put, etc use cors
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import productsRouter from "./routes/productsRoute.js";
import userRouter from "./routes/usersRoutes.js";
import cloudinaryConfig from "./config/cloudinaryConfig.js";
import passportStrategy from "./config/passportConfig.js";
import passport from "passport";
console.log("comment only to not have colors as an unused import", colors);

// loading .env file
dotenv.config();

const app = express();

const port = process.env.PORT || 5100; //we use the PORT variable to let our project ready for deployment, because we don't know which PORT will be used in the server. 5100 is our local port while developing the project.

function addMiddleWares() {
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  // app.use(cors());
  //Using CORS options to secure the origin of the requests
  const allowedOrigins = [
    "http://localhost:5173",
    "http://combay.vercel.app",
    "https://combay.vercel.app",
  ];
  const corsOptions = {
    origin: function (origin, callback) {
      // !origin will allow to accept direct calls to the api , with no heading, e.g. http://localhost:5001/api/cities/all
      //origin will allow requests with no header (origin===undefined), the direct ones (using directly the server url). This solution will now accept only request from those 2 origins, or with no header.
      //Accepting requests with no header might pose a security threat ...research how convinient the solution is.

      // if (allowedOrigins.indexOf(origin) !== -1) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };
  app.use(cors(corsOptions));

  cloudinaryConfig();
  passport.initialize(); //passport-jwt - This module lets you authenticate endpoints using a JSON web token JWT
  passport.use(passportStrategy);
}

function startServer() {
  //listen to requests from the client through port 5100
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`.bgGreen);
  });
}

function loadRoutes() {
  //whatever arrives in localhost:5100/api, will trigger usersRoute or productsRoute
  app.use("/api/products", productsRouter);
  app.use("/api/users", userRouter);
}

// establishes the connection to the database
async function DBConnection() {
  try {
    const mongoDBConnection = await mongoose.connect(process.env.MONGODB_URI);
    if (mongoDBConnection) {
      console.log("Connected with MongoDB".bgGreen);
    }
  } catch (error) {
    console.log("Error connecting to MongoDB:>> ".bgRed, error);
  }
}

//IIFE Immidiately Invoked Function Expression
// Create a local scope for variables to prevent them from polluting the global scope.
//The function is wrapped in parentheses (function() { ... }), followed by () to immediately invoke it.
(async function controller() {
  await DBConnection();
  addMiddleWares();
  loadRoutes();
  startServer();
})();
