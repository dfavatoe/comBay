import multer from "multer";
import path from "path";

const storage = multer.diskStorage({});
const limits = { fileSize: 5 * 1024 * 1024 }; // Handling file size directly in Multer
const fileFilter = (req, file, cb) => {
  console.log("file :>> ", file);
  //check the file extension to decide if we allow upload or not
  let extension = path.extname(file.originalname);
  if (extension !== ".png" && extension !== ".jpg" && extension !== ".jpeg") {
    console.log("File extension not supported.".bgRed);
    // To reject this file pass `false`, like so:
    // cb(null, false);
    cb(
      new Error(
        `You are trying to upload a ${extension} file. Only images are supported. `
      )
    );
  } else {
    // To accept the file pass `true`, like so:
    console.log("Files accepted.");
    cb(null, true);
  }

  // // You can always pass an error if something goes wrong:
  // cb(new Error("I don't have a clue!"));
};

const multerUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

const customisedMulter = multerUpload.single("image");

const multerWithCustomErrors = function (req, res, next) {
  customisedMulter(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({
        error: err.message,
      });
    } else if (err) {
      // an unknown error ocurred when uploading.
      return res.status(400).json({
        error: "We don't know what happened, but couldn't upload the file",
        errorMessage: err.message,
      });
    }
    //Everything went well
    next();
  });
};
// export default multerUpload;
export default multerWithCustomErrors;
