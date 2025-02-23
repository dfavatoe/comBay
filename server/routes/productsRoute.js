import express from "express";
import { getAllProducts } from "../controller/productsController.js";

const productsRouter = express.Router();

productsRouter.get("/all", getAllProducts);

export default productsRouter;
