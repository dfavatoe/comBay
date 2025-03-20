import CategoryListModel from "../models/categoriesModel.js";
import ProductModel from "../models/productsModel.js";
import UserModel from "../models/usersModel.js";
import { getAllRecords } from "./getAllRecords.js";

// const getAllProducts = async (req, res) => {
//   console.log("get All products running");

//   try {
//     const allProducts = await ProductModel.find().populate({
//       path: "seller",
//       select: ["sName", "sAddress"],
//     });

//     console.log("allProducts :>> ", allProducts);
//     if (allProducts.length === 0) {
//       //! should the status code below be 200 or 400?
//       res.status(200).json({
//         message: "No records found in the database.",
//         amount: allProducts.length,
//         allProducts,
//       });
//     }

//     res.status(200).json({
//       message: "All the records from the database.",
//       amount: allProducts.length,
//       allProducts,
//     });
//   } catch (error) {
//     console.log("error :>> ", error);
//     res.status(500).json({
//       error: "something went wrong",
//     });
//   }
// };

// const getAllProducts = getAllRecords(ProductModel, {
//   path: "seller",
//   select: ["name", "address"],
// });

const getAllProducts = getAllRecords(ProductModel, {
  path: "seller",
  select: ["userName", "email"],
});

//========================================================

const getCategoriesList = getAllRecords(CategoryListModel);

//========================================================

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
        message: `No products with category ${req.params.category} and/or rating greater than ${req.query.rating} found in the database.`,
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

//========================================================

const getProductById = async (req, res) => {
  console.log("controller function running");

  console.log("params :>> ", req.params);

  const { id } = req.params;

  try {
    const productById = await ProductModel.findById(id).populate({
      path: "seller",
      select: ["userName", "email"],
    });
    if (productById.length === 0) {
      res.status(400).json({
        message: `No products with id ${id} found in the database.`,
        amount: 0,
      });
      return;
    }

    res.status(200).json({
      message: `Product with id ${id}`,
      productById,
    });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

//========================================================

const addProduct = async (req, res) => {
  // console.log("addProduct working");
  // console.log("req :>> ", req);

  const {
    title,
    brand,
    description,
    category,
    price,
    stock,
    seller,
    images,
    warranty,
    returnPolicy,
    reservation,
    minReservationQty,
    reservationTime,
    discountPercentage,
    width,
    height,
    depth,
    rating,
  } = req.body;
  console.log("req.body :>> ", req.body);

  try {
    //product cannot exist already by this seller
    const existingProduct = await ProductModel.findOne({
      title: title,
      seller: seller,
    });

    if (existingProduct) {
      return res.status(400).json({
        message: "Seller already has this product in the database",
      });
    }
    if (!existingProduct) {
      const newProductObject = new ProductModel({
        title: title,
        brand: brand,
        description: description,
        category: category,
        price: price,
        stock: stock,
        seller: seller,
        images: images,
        warranty: warranty,
        returnPolicy: returnPolicy,
        reservation: reservation,
        minReservationQty: minReservationQty,
        reservationTime: reservationTime,
        discountPercentage: discountPercentage,
        rating: rating,
        width: width,
        height: height,
        depth: depth,
      });

      console.log("newProductObject :>> ", newProductObject);

      const newProduct = await newProductObject.save();
      console.log("newProduct :>> ", newProduct);

      if (newProduct) {
        return res.status(200).json({
          message: "Product registered successfully",
          product: {
            id: newProduct._id,
            title: newProduct.title,
            brand: newProduct.brand,
            description: newProduct.description,
            category: newProduct.category,
            price: newProduct.price,
            stock: newProduct.stock,
            seller: newProduct.seller,
            images: newProduct.images,
            warranty: newProduct.warranty,
            returnPolicy: newProduct.returnPolicy,
            reservation: newProduct.reservation,
            minReservationQty: newProduct.minReservationQty,
            reservationTime: newProduct.reservationTime,
            discountPercentage: newProduct.discountPercentage,
            rating: newProduct.rating,
            width: newProduct.width,
            height: newProduct.height,
            depth: newProduct.depth,
          },
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong during register.",
      errorStack: error.message,
    });
  }
};

//========================================================

const getProductsBySeller = async (req, res) => {
  console.log("getSellersProducts running");

  console.log("params :>> ", req.params);

  const { seller_id } = req.params;

  try {
    const productsBySeller = await ProductModel.find({
      seller: seller_id,
    });

    const sellerInfo = await UserModel.findById(seller_id);
    if (productsBySeller.length === 0) {
      res.status(400).json({
        message: `No products by seller ${req.params.seller_id} found in the database.`,
      });
      return; //If no products are found stop other responses
    }

    res.status(200).json({
      message: `All products from seller ${req.params.seller} in the database.`,
      amount: productsBySeller.length,
      sellerInfo: {
        id: sellerInfo._id,
        userName: sellerInfo.userName,
        email: sellerInfo.email,
        image: sellerInfo.image,
        address: sellerInfo.address,
        created_at: sellerInfo.created_at,
      },
      productsBySeller,
    });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export {
  getAllProducts,
  getProductsByCategory,
  getCategoriesList,
  getProductById,
  addProduct,
  getProductsBySeller,
};
