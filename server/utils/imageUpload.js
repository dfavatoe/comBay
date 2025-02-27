import { v2 as cloudinary } from "cloudinary";

const uploadToCloudinary = async (file) => {
  try {
    const uploadedImage = await cloudinary.uploader.upload(file.path, {
      folder: "comBay",
    });
    return uploadedImage;
  } catch (error) {
    console.log("error uploading to cloundinary :>> ", error);

    return null;
  }
};

export default uploadToCloudinary;
