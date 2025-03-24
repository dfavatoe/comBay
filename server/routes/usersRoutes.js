import express from "express";
import {
  imageUpload,
  getAllUsers,
  registerNewUser,
  login,
  getProfile,
  putUpdateName,
  putUpdateAddress,
  deleteAddress,
  addProductInList,
  getProductsShoppingList,
  updateCompleteAddress,
  updateAddress,
} from "../controller/usersController.js";
import multerWithCustomErrors from "../middleware/multer.js";
import jwtAuth from "../middleware/jwtAuth.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
// userRouter.post("/uploadimage", multerUpload.single("image"), imageUpload);
//custom middleare to catch multer errors
userRouter.post("/uploadimage", multerWithCustomErrors, imageUpload);
userRouter.post("/register", registerNewUser);
userRouter.post("/login", login);
userRouter.get("/profile", jwtAuth, getProfile); //in order to get the profile, authorize with the token
// REVIEW check the different HTTP methods to see what is the adecuated one to update some fields: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods

userRouter.put("/update-name", jwtAuth, putUpdateName);
userRouter.put("/update-address", jwtAuth, updateAddress);
userRouter.put("/updateCompleteAddress", jwtAuth, updateCompleteAddress);
userRouter.delete("/delete-address", jwtAuth, deleteAddress);
userRouter.post("/add-productToList", jwtAuth, addProductInList);
userRouter.get("/productsList", jwtAuth, getProductsShoppingList);

export default userRouter;
