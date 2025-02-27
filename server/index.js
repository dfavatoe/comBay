import express from "express";
import colors from "colors";
import cors from "cors";
import testRouter from "./routes/testRoute.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import productsRouter from "./routes/productsRoute.js";
import sellersRouter from "./routes/sellersRoute.js";
import userRouter from "./routes/usersRoute.js";

// loading .env file
dotenv.config();

const app = express();

const port = process.env.PORT || 5100; //we use the PORT variable to let our project ready for deployment, because we don't know which PORT will be used in the server. 5100 is our port while developing the project.

function addMiddleWares() {
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(cors());
}

function startServer() {
  //listen to requests from the client through port 5100
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`.bgGreen);
  });
}

function loadRoutes() {
  app.use("/api", testRouter); //whatever arrives in localhost:5100/api, I'll trigger testRouter
  app.use("/api/products", productsRouter);
  app.use("/api/sellers", sellersRouter);
  app.use("/api/users", userRouter);
}

// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
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

//The order in which these functions are called is important
// async function controller() {
//   await DBConnection();
//   addMiddleWares();
//   loadRoutes();
//   startServer();
// }
// controller();

//IIFE Immidiately Invoked Function Expression
// Create a local scope for variables to prevent them from polluting the global scope.
//The function is wrapped in parentheses (function() { ... }), followed by () to immediately invoke it.
//! Why are we using IIFE here? Why it is not the same as calling "controller()"?
(async function controller() {
  await DBConnection();
  addMiddleWares();
  loadRoutes();
  startServer();
})();
