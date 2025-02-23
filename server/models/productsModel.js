import mongoose from "mongoose";

// create the Schema for the collection
const productsSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: String,
  category: String,
  price: { type: Number, require: true },
  discountPercentage: Number,
  rating: Number,
  stock: { type: Number, require: true },
  tags: [String],
  brand: String,
  sku: String,
  weight: Number,
  dimensions: {
    width: { type: Number },
    height: { type: Number },
    depth: { type: Number },
  },
  reviews: {
    rating: { type: Number },
    comment: { type: Number },
    date: { type: Date, default: Date.now },
    reviewerName: { type: String },
    reviewerEmail: { type: String },
  },
  meta: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    barcode: { type: String },
    qrcode: { type: String },
  },
  thumbnail: String,
  images: [String],
});

// turns the Schema into a Model
const ProductModel = mongoose.model("Product", productsSchema); //Product has to be in singular.

export default ProductModel;
