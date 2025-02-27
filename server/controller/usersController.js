import UserModel from "../models/usersModel.js";
import uploadToCloudinary from "../utils/imageUpload.js";

const getAllUsers = async (req, res) => {
  console.log("all users working");
  try {
    //use populate() if necessary
    const allUsers = await UserModel.find();

    return res.status(200).json({
      message: "All users from the database",
      number: allUsers.length,
      allUsers,
    });
  } catch (error) {
    console.log("error :>> ", error);
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const imageUpload = async (req, res) => {
  console.log("imageUpload working");
  console.log("req file :>> ", req.file);
  if (!req.file) {
    return res.status(500).json({
      error: "File not supported",
    });
  }
  if (req.file) {
    //check file size
    //Upload file to Cloudinary
    const uploadedImage = await uploadToCloudinary(req.file);

    console.log("uploadedImage:".green, uploadedImage);
    if (!uploadedImage) {
      return res.status(400).json({
        error: "Image couldn't be uploaded",
      });
    }

    if (uploadedImage) {
      res.status(200).json({
        message: "Image uploaded successfully",
        imageURL: uploadedImage.secure_url,
      });
    }
  }
};

const registerUser = async (req, res) => {
  console.log("user's register working");
  console.log("req :>> ", req);
};

export { registerUser, imageUpload, getAllUsers };
