import ProductModel from "../models/productsModel.js";

const getAllProducts = async (req, res) => {
  console.log("get All products running");

  try {
    const allProducts = await ProductModel.find();

    console.log("allProducts :>> ", allProducts);
    if (allProducts.length === 0) {
      res.status(200).json({
        message: "No records found in the database.",
        amount: allProducts.length,
        allProducts,
      });
    }

    res.status(200).json({
      message: "All the records from the database.",
      amount: allProducts.length,
      allProducts,
    });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

export { getAllProducts };
