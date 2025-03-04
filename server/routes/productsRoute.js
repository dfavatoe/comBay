import express from "express";
import {
  getAllProducts,
  getCategoriesList,
  getProductById,
  getProductsByCategory,
} from "../controller/productsController.js";

const productsRouter = express.Router();

productsRouter.get("/", getAllProducts);
productsRouter.get("/categories/:category", getProductsByCategory);
productsRouter.get("/categories-list", getCategoriesList);
productsRouter.get("/productId/:id", getProductById);

export default productsRouter;
