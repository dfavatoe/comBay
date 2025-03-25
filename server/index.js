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
  app.use(cors());
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
