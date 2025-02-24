import ProductModel from "../models/productsModel.js";

const getAllProducts = async (req, res) => {
  console.log("get All products running");

  try {
    const allProducts = await ProductModel.find().populate({
      path: "seller",
      select: ["s_name", "s_address"],
    });

    console.log("allProducts :>> ", allProducts);
    if (allProducts.length === 0) {
      //! should the status code below be 200 or 400?
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

const getProductsByCategory = async (req, res) => {
  console.log("controller function running"); // Try in Postman and check the CLI
  // console.log("req :>> ", req); // huge object is returned (check the property params: { category: 'whatever' } or query: )
  console.log("params :>> ", req.params);
  console.log("query :>> ", req.query);

  const category = req.params.category;
  // const { category } = req.params; // destructured option
  if (req.query.rating) {
    console.log("Request with ratings comming");

    const productsByCategoryAndRating = await ProductModel.find({
      category: req.params.category,
      rating: { $gte: req.query.rating },
    });

    if (productsByCategoryAndRating.length === 0) {
      res.status(400).json({
        message: `No products with category ${req.params.category} and/or rating grater than ${req.query.rating} found in the database.`,
        amount: productsByCategoryAndRating.length,
        productsByCategoryAndRating,
      });
      return; // return here is necessary to stop the server from sending to responses ( which is not possible including the following one), in case the first one is true.
    }

    res.status(200).json({
      message: `All products in the ${req.params.category} category with ratings greater than ${req.query.rating}.`,
      productsByCategoryAndRating,
    });

    return;
  }

  if (!req.query.rating) {
    try {
      const productsByCategory = await ProductModel.find({
        category: req.params.category,
      });
      if (productsByCategory.length === 0) {
        res.status(400).json({
          message: `No products with category ${req.params.category} found in the database.`,
          amount: productsByCategory.length,
          productsByCategory,
        });
        return; // return here is necessary to stop the server from sending to responses ( which is not possible including the following one), in case the first one is true.
      }

      res.status(200).json({
        message: `All products in the ${req.params.category} category from the database.`,
        amount: productsByCategory.length,
        productsByCategory,
      });
    } catch (error) {
      console.log("error :>> ", error);
      res.status(500).json({
        error: "something went wrong",
      });
    }
  }
};

export { getAllProducts, getProductsByCategory };
