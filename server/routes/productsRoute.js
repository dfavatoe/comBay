import express from "express";
import {
  addProduct,
  addProductReview,
  getAllProducts,
  getCategoriesList,
  getProductById,
  getProductReviews,
  getProductsByCategory,
  getProductsBySeller,
} from "../controller/productsController.js";
import jwtAuth from "../middleware/jwtAuth.js";

const productsRouter = express.Router();

productsRouter.get("/", getAllProducts);
productsRouter.get("/categories/:category", getProductsByCategory);
productsRouter.get("/categories-list", getCategoriesList);
productsRouter.get("/productId/:id", getProductById);
productsRouter.put("/add-product", jwtAuth, addProduct);
productsRouter.get("/seller/:seller_id", getProductsBySeller);
productsRouter.post("/review/:product_id", jwtAuth, addProductReview);
productsRouter.get("/review/:product_id", getProductReviews);

export default productsRouter;
