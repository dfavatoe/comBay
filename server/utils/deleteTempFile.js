import fs from "fs";
//delete temporary file created by multer
const deleteTempFile = (file) => {
  if (file) {
    fs.unlink(file.path, function (err) {
      if (err) throw err;
      console.log("File deleted");
    });
  } else {
    console.log("I can only remove files!");
  }
};

export default deleteTempFile;
