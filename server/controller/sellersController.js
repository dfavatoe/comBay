import SellerModel from "../models/sellersModel.js";

const getAllSellers = async (req, res) => {
  // console.log("all sellers working");
  try {
    const allSellers = await SellerModel.find().populate({
      path: "sProducts",
      select: ["title", "price"],
    });

    return res.status(200).json({
      message: "All sellers from the database",
      number: allSellers.length,
      allSellers,
    });
  } catch (error) {
    console.log("error :>> ", error);
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const logoUpload = async (req, res) => {
  console.log("logoUpload working");
  console.log("req file :>> ", req.file);
};

const registerSeller = async (req, res) => {
  console.log("seller's register working");
  console.log("req :>> ", req);
};

export { getAllSellers, logoUpload, registerSeller };
