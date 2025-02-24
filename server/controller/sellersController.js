import SellerModel from "../models/sellersModel.js";

const getAllSellers = async (req, res) => {
  // console.log("all sellers working");
  try {
    const allSellers = await SellerModel.find().populate({
      path: "s_products",
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

export { getAllSellers };
