import mongoose from "mongoose";

const { Schema } = mongoose;

const cartsSchema = Schema({
  _id: Schema.Types.ObjectId,
  products: [
    {
      //Total by Type of Product
      productKind: {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        productQty: { type: Number, require: true },
        productTotal: { type: Number },
        productDiscountedTotal: { type: Number },
      },
      //Total for all Types of Products
      productsTotalQty: { type: Number },
      productsTotal: { type: Number },
      user: { type: Schema.Types.ObjectId, ref: "User" },
      timestamp: {
        timestamps: {
          createdAt: "created_at",
          updatedAt: "updated_at",
        },
      },
    },
  ],
});
