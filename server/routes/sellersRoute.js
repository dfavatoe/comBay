import express from "express";
import { getAllSellers } from "../controller/sellersController.js";

const sellersRouter = express.Router();

sellersRouter.get("/all", getAllSellers);

export default sellersRouter;
