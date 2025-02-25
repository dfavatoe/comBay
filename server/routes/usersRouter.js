import express from "express";
import { register } from "../controller/usersController.js";

const usersRouter = express.Router();

usersRouter.post("/register", register);

export default usersRouter;
