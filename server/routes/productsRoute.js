import express from "express";
import {
  getAllProducts,
  getProductsByCategory,
} from "../controller/productsController.js";

const productsRouter = express.Router();

productsRouter.get("/all", getAllProducts);
productsRouter.get("/all/categories/:category", getProductsByCategory);

export default productsRouter;
