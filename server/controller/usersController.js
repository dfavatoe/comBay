import UserModel from "../models/usersModel.js";

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

const avatarUpload = async (req, res) => {
  console.log("avatarUpload working");
  console.log("req file :>> ", req.file);
};

const registerUser = async (req, res) => {
  console.log("user's register working");
  console.log("req :>> ", req);
};

export { registerUser, avatarUpload, getAllUsers };
