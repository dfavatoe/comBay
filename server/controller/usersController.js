import UserModel from "../models/usersModel.js";
import deleteTempFile from "../utils/deleteTempFile.js";
import { hashingPassword, verifyPassword } from "../utils/passwordServices.js";
import uploadToCloudinary from "../utils/imageUpload.js";
import { generateToken } from "../utils/tokenServices.js";
import * as dotenv from "dotenv";

// loading .env file
dotenv.config();

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

//==========================================================

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

//=========================================================

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

  try {
    //Check if user exists in database
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

//=========================================================

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

//=========================================================

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
        _id: req.user._id,
        userName: req.user.userName,
        email: req.user.email,
        role: req.user.role,
        image: req.user.image,
        productsList: req.user.productsList,
        address: req.user.address,
      },
    });
  }
};

//=========================================================

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
        productsList: req.user.productsList,
        address: req.user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

//=========================================================

const putUpdateAddress = async (req, res) => {
  console.log("update user address");
  console.log("req.user :>> ", req.user);
  console.log("req.body :>> ", req.body);
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: "Address is required" });

  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    //Update or create the address field
    user.address = address; //add or update the address field with the value of the req.body
    await user.save(); //Saves this document by inserting it into the database

    return res.json({
      message: "Address updated successfully",
      user: {
        id: req.user._id,
        userName: req.user.userName,
        email: req.user.email,
        role: req.user.role,
        image: req.user.image,
        productsList: req.user.productsList,
        address: req.user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

//=========================================================

const updateAddress = async (req, res) => {
  console.log("update address running");

  const { streetName, streetNumber, city, state, country, postalcode } =
    req.body;

  const api_key = process.env.GEO_API_KEY;

  if (!streetName || !streetNumber || !city || !postalcode) {
    return res.status(400).json({
      error: "street name, street number, city and postal code are required",
    });
  }

  // Fetch geolocation
  const response = await fetch(
    `https://geocode.maps.co/search?street=${streetNumber}+${streetName}&city=${city}&state=${state}&postalcode=${postalcode}&country=${country}&api_key=${api_key}`
  );

  const result = await response.json();
  // const [latitude, longitude]=await getLocation(streetName, streetName, city)
  console.log("Geolocation API response:", result);
  if (!result.length) {
    return res
      .status(400)
      .json({ error: "Geolocation API returned no results" });
  }
  const lat = result[0].lat; //get the latitude from the first object in the array
  const lon = result[0].lon;
  console.log("Geolocation API response:", result);

  try {
    //Update user fields

    const newAddress = {
      streetName,
      streetNumber,
      city,
      state,
      country,
      postalcode,
      latitude: lat,
      longitude: lon,
    };

    const newUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      { address: newAddress },
      { new: true }
    );
    if (!newUser) return res.status(400).json({ error: "User not found" });

    console.log("newUser :>> ", newUser);

    return res.status(200).json({
      message: "Complete address updated successfully",
      user: {
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
        productsList: newUser.productsList,
        address: newUser.address,
      },
    });
  } catch (error) {
    console.error("Error adding address", error);
    return res.status(500).json({
      error: "Internal Server Error",
      errorStack: error.message,
    });
  }
};

//=========================================================

const updateCompleteAddress = async (req, res) => {
  console.log("update complete user address");

  const { streetName, streetNumber, city, state, country, postalcode } =
    req.body;

  const api_key = process.env.GEO_API_KEY;

  if (!streetName || !streetNumber || !city || !postalcode) {
    return res.status(400).json({
      error: "street name, street number, city and postal code are required",
    });
  }

  // Fetch geolocation
  const response = await fetch(
    `https://geocode.maps.co/search?street=${streetNumber}+${streetName}&city=${city}&state=${state}&postalcode=${postalcode}&country=${country}&api_key=${api_key}`
  );

  const result = await response.json();
  // const [latitude, longitude]=await getLocation(streetName, streetName, city)
  console.log("Geolocation API response:", result);
  if (!result.length) {
    return res
      .status(400)
      .json({ error: "Geolocation API returned no results" });
  }
  const lat = result[0].lat; //get the latitude from the first object in the array
  const lon = result[0].lon;
  console.log("Geolocation API response:", result);

  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(400).json({ error: "User not found" });

    //Update user fields

    user.streetName = streetName;
    user.streetNumber = streetNumber;
    user.city = city;
    user.state = state;
    user.country = country;
    user.postalcode = postalcode;
    user.latitude = lat;
    user.longitude = lon;

    const updatedUser = await user.save();
    console.log("updatedUser :>> ", updatedUser);

    return res.json({
      message: "Complete address updated successfully",
      user: {
        id: updatedUser._id,
        userName: updatedUser.userName,
        email: updatedUser.email,
        role: updatedUser.role,
        image: updatedUser.image,
        productsList: updatedUser.productsList,
        address: updatedUser.address,
        streetName: updatedUser.streetName,
        streetNumber: updatedUser.streetNumber,
        city: updatedUser.city,
        country: updatedUser.country,
        postalcode: updatedUser.postalcode,
        latitude: lat,
        longitude: lon,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong while updating the address.",
      errorStack: error.message,
    });
  }
};

//=========================================================

const deleteAddress = async (req, res) => {
  console.log("delete user address");
  console.log("req.user :>> ", req.user);

  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    //Delete the address field setting as undefined
    user.address = undefined;
    await user.save(); //Saves this document by inserting it into the database

    res.json({
      message: "Address deleted successfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        image: user.image,
        productsList: user.productsList,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Server Error",
      errorStack: error.message,
    });
  }
};

//=========================================================

const addProductInList = async (req, res) => {
  console.log("addProductInList working");

  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { productsList } = req.body;
    // console.log("req.body :>> ", req.body);

    //check if product is already in the user's list
    const existingProductInList = await UserModel.findOne({
      _id: req.user._id, // Find the user first
      productsList: productsList, // Check if they have the product
    });

    if (existingProductInList) {
      return res.status(400).json({
        message: "User already has this product in the shopping list.",
      });
    }

    user.productsList.push(productsList); //push the new product ID to the array
    await user.save();

    return res.status(200).json({
      message: "Product successfully added to the shopping list",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        image: user.image,
        productsList: user.productsList,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Error adding product to list", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

//=========================================================

const getProductsShoppingList = async (req, res) => {
  console.log("get products from shopping list running");

  try {
    const user = await UserModel.findById(req.user._id).populate({
      path: "productsList",
      populate: {
        path: "seller", // Populating the seller inside each product
        select: ["userName", "address"], // Selecting only the seller's userName
      },
      select: [
        "title",
        "price",
        "rating",
        "images",
        "reservation",
        "reservationTime",
        "seller",
      ], // include seller
    });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (user.productsList.length === 0) {
      res.status(200).json({
        message: "The list is empty.",
        amount: user.productsList.length,
      });
    } else {
      res.status(200).json({
        message: "All products in the list.",
        amount: user.productsList.length,
        records: user.productsList,
      });
    }

    console.log("productsList :>> ", user.productsList);
  } catch (error) {
    console.error("Error fetching products list: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//=========================================================

export {
  registerNewUser,
  imageUpload,
  getAllUsers,
  login,
  getProfile,
  putUpdateName,
  putUpdateAddress,
  updateAddress,
  updateCompleteAddress,
  deleteAddress,
  addProductInList,
  getProductsShoppingList,
};
