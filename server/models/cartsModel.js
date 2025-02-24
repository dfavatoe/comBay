import mongoose from "mongoose";

const { Schema } = mongoose;

const cartsSchema = Schema({
  _id: Schema.Types.ObjectId,
  cProducts: [
    {
      //Total by Type of Product
      cProductByType: {
        pTypeObject: { type: Schema.Types.ObjectId, ref: "Product" },
        pTypeQty: { type: Number, require: true },
        pTypeTotal: { type: Number },
        pTypeDiscountedTotal: { type: Number },
      },
      //Total for all Types of Products
      pTotalQty: { type: Number },
      pTotal: { type: Number },
      ser: { type: Schema.Types.ObjectId, ref: "User" },
      timestamp: {
        timestamps: {
          createdAt: "created_at",
          updatedAt: "updated_at",
        },
      },
    },
  ],
});
