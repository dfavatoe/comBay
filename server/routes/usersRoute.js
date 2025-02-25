import express from "express";
import { avatarUpload, register } from "../controller/usersController.js";
import multerUploader from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/uploadavatar", multerUploader.single("avatar"), avatarUpload);
userRouter.post("/register", register);

export default userRouter;
