import express from "express";
import {
  getAllSellers,
  logoUpload,
  registerSeller,
} from "../controller/sellersController.js";
import multerUpload from "../middleware/multer.js";

const sellersRouter = express.Router();

sellersRouter.get("/", getAllSellers);

// sellersRouter.post("/uploadlogo", multerUpload.single("logo"), logoUpload);

sellersRouter.post("/registerseller", registerSeller);

export default sellersRouter;
