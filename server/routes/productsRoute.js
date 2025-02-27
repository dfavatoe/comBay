import express from "express";
import {
  getAllProducts,
  getCategoriesList,
  getProductsByCategory,
} from "../controller/productsController.js";

const productsRouter = express.Router();

productsRouter.get("/", getAllProducts);
productsRouter.get("/categories/:category", getProductsByCategory);
productsRouter.get("/categories-list", getCategoriesList);

export default productsRouter;
