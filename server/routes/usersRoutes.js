import express from "express";
import {
  imageUpload,
  getAllUsers,
  registerNewUser,
  login,
} from "../controller/usersController.js";
import multerUploader from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.post("/uploadimage", multerUploader.single("image"), imageUpload);
userRouter.post("/register", registerNewUser);
userRouter.post("/login", login);

export default userRouter;
