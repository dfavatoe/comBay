import express from "express";
import {
  avatarUpload,
  getAllUsers,
  registerUser,
} from "../controller/usersController.js";
import multerUploader from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.post("/uploadavatar", multerUploader.single("avatar"), avatarUpload);
userRouter.post("/registeruser", registerUser);

export default userRouter;
