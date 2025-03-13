import express from "express";
import {
  addProduct,
  getAllProducts,
  getCategoriesList,
  getProductById,
  getProductsByCategory,
} from "../controller/productsController.js";
import jwtAuth from "../middleware/jwtAuth.js";

const productsRouter = express.Router();

productsRouter.get("/", getAllProducts);
productsRouter.get("/categories/:category", getProductsByCategory);
productsRouter.get("/categories-list", getCategoriesList);
productsRouter.get("/productId/:id", getProductById);
productsRouter.put("/add-product", jwtAuth, addProduct);

export default productsRouter;
