import express from "express";
import {
  imageUpload,
  getAllUsers,
  registerNewUser,
  login,
  getProfile,
} from "../controller/usersController.js";
import multerUpload from "../middleware/multer.js";
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

export default userRouter;
