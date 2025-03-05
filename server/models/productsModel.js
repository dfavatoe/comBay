import mongoose from "mongoose";

const { Schema } = mongoose;

// create the Schema for the collection
const productsSchema = new Schema(
  {
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
    reservation: Boolean,
    reservationTime: Number,
    minReservationQty: Number,
    warranty: String,
    returnPolicy: String,
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
      barcode: { type: String },
      qrcode: { type: String },
    },
    thumbnail: String,
    images: [String],
    // seller: { type: Schema.Types.ObjectId, ref: "Seller" },
    seller: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// turns the Schema into a Model
const ProductModel = mongoose.model("Product", productsSchema); //Product has to be in singular.

export default ProductModel;
