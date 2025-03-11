import UserModel from "../models/usersModel.js";
import deleteTempFile from "../utils/deleteTempFile.js";
import { hashingPassword, verifyPassword } from "../utils/passwordServices.js";
import uploadToCloudinary from "../utils/imageUpload.js";
import { generateToken } from "../utils/tokenServices.js";

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

  // user name validation in the controller:
  if (userName.length < 3) {
    return res.status(400).json({
      error: "User name should be at least 3 characters.",
    });
  }

  // email validation in the controller:
  if (password.length < 6) {
    return res.status(400).json({
      error: "Password should be at least 6 characters.",
    });
  }

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
          //! Generic image is not working. Check possible problem in the form field in the frontend. Works just with Postman
          image: image
            ? image
            : "https://img.freepik.com/vecteurs-libre/homme-affaires-caractere-avatar-isole_24877-60111.jpg",
          role: role,
        });

        console.log("newUserObject :>> ", newUserObject);
        //Model.prototype.save()
        //Saves this new document by inserting it into the database
        const newUser = await newUserObject.save();
        console.log("newUser :>> ", newUser);

        //! The token generation was happening just in the login. I created this token generation in the register, because the user was still not identified in the context after signing up. Check if this will still be necessary after the last spike.
        if (newUser) {
          //Generate JWT token
          const token = generateToken(newUser._id, newUser.role);
          if (!token) {
            return res.status(500).json({
              error:
                "Something went wrong generating the token. Try to register again later.",
            });
          }
          if (token) {
            return res.status(200).json({
              message: "User registered successfully",
              user: {
                id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                image: newUser.image,
                role: newUser.role,
              },
              token, //= token: token
            });
          }
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

const login = async (req, res) => {
  const { email, password } = req.body;

  //1. find user in DB

  try {
    const existingUser = await UserModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({
        message: "User don't have an account, register first.",
      });
    }
    if (existingUser) {
      //2. Verify password (compare password written in login form with hashedpass)
      const isPasswordCorrect = await verifyPassword(
        password,
        existingUser.password
      );
      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Invalid password credential.",
        });
      }

      if (isPasswordCorrect) {
        //Generate JWT token
        const token = generateToken(existingUser._id, existingUser.role);
        if (!token) {
          return res.status(500).json({
            error: "Something went wrong, try to login later.",
          });
        }
        if (token) {
          return res.status(200).json({
            message: "Login successful",
            user: {
              id: existingUser._id,
              userName: existingUser.userName,
              email: existingUser.email,
              role: existingUser.role,
              image: existingUser.image,
            },
            token, //= token: token
          });
        }
      }
    }
  } catch (error) {
    console.log("error :>> ", error);
    return res.status(500).json({
      error: "Something went wrong during login.",
      errorMessage: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  console.log("get profile");
  console.log("req.user :>> ", req.user);
  if (!req.user) {
    return res.status(404).json({
      error: console.log("User has to log in again"),
    });
  }
  if (req.user) {
    return res.status(200).json({
      message: "User profile",
      user: {
        id: req.user._id,
        userName: req.user.userName,
        email: req.user.email,
        role: req.user.role,
        image: req.user.image,
        createdAt: req.user.created_at,
        product: req.user.product,
        productsList: req.user.productsList,
        address: req.user.address,
      },
    });
  }
};

const putUpdateName = async (req, res) => {
  console.log("update user name");
  console.log("req.user :>> ", req.user);
  const { userName } = req.body;
  if (!userName) return res.status(400).json({ error: "Name is required" });

  try {
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { userName },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      message: "Name updated successfully",
      user: {
        id: req.user._id,
        userName: req.user.userName,
        email: req.user.email,
        role: req.user.role,
        image: req.user.image,
        createdAt: req.user.created_at,
        product: req.user.product,
        productsList: req.user.productsList,
        address: req.user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const putUpdateAddress = async (req, res) => {
  console.log("update user address");
  console.log("req.user :>> ", req.user);
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: "Address is required" });

  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    //Update or create the address field
    user.address = address;
    await user.save(); //Saves this new document by inserting it into the database

    res.json({
      message: "Address updated successfully",
      user: {
        id: req.user._id,
        userName: req.user.userName,
        email: req.user.email,
        role: req.user.role,
        image: req.user.image,
        createdAt: req.user.created_at,
        product: req.user.product,
        productsList: req.user.productsList,
        address: req.user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export {
  registerNewUser,
  imageUpload,
  getAllUsers,
  login,
  getProfile,
  putUpdateName,
  putUpdateAddress,
};
