import UserModel from "../models/usersModel.js";
import deleteTempFile from "../utils/deleteTempFile.js";
import { hashingPassword } from "../utils/hashingPassword.js";
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
      deleteTempFile(req.file);
      return res.status(400).json({
        error: "Image couldn't be uploaded",
      });
    }

    if (uploadedImage) {
      deleteTempFile(req.file);
      res.status(200).json({
        message: "Image uploaded successfully",
        imageURL: uploadedImage.secure_url,
      });
    }
  }
};

const registerNewUser = async (req, res) => {
  // console.log("user's register working");
  // console.log("req :>> ", req);
  const { userName, email, password, image, role } = req.body;
  console.log("req.body :>> ", req.body);

  if (password < 4) {
    return res.status(400).json({
      error: "Password should be at least 4 characters.",
    });
  }

  //example of validation in the controller:
  // if (userName.length < 100) {
  //   return res.status(400).json({
  //     error: "Username too short",
  //   });

  //Check if user exists in database
  try {
    const existingUser = await UserModel.findOne({ emai: email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists in the database",
      });
    }
    if (!existingUser) {
      //Hash the password to protect others from seeing the original one.
      const hashedPassword = await hashingPassword(password);
      console.log("hashedPassword :>> ", hashedPassword);

      if (!hashedPassword) {
        return res.status(500).json({
          error:
            "We couldn't register the user, problem with hashing the password.",
        });
      }

      if (hashedPassword) {
        const newUserObject = new UserModel({
          userName: userName,
          email: email,
          password: hashedPassword,
          image: image
            ? image
            : "https://img.freepik.com/vecteurs-libre/homme-affaires-caractere-avatar-isole_24877-60111.jpg",
          role: role,
        });

        console.log("newUserObject :>> ", newUserObject);
        //Model.prototype.save()
        //Saves this document by inserting a new document into the database
        const newUser = await newUserObject.save();
        console.log("newUser :>> ", newUser);

        if (newUser) {
          return res.status(201).json({
            message: "User registered successfully",
            user: {
              id: newUser._id,
              userName: newUser.userName,
              email: newUser.email,
              image: newUser.image,
              role: newUser.role,
            },
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong during register.",
      errorStack: error.message,
    });
  }
};

export { registerNewUser, imageUpload, getAllUsers };
