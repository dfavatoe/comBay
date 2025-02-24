import mongoose from "mongoose";

const { Schema } = mongoose;

//how to create a schema to be like a type:
// const geoSchema = new Schema({
//   geo: {
//     lat: { type: Number, require: true },
//     lon: { type: Number, require: true },
//     pluscode: { type: String },
//   },
// });

const sellersSchema = new Schema({
  _id: Schema.Types.ObjectId,
  sName: { type: String, require: true },
  sEmail: { type: String, require: true },
  s_url: String,
  sPassword: { type: String, require: true },
  sAddress: { type: String, require: true },
  geo: {
    lat: { type: Number, require: true },
    lon: { type: Number, require: true },
    pluscode: { type: String, require: false },
  },
  sProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  timestamp: {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  // geo: {
  //   geo: {
  //     type: geoSchema,
  //   },
  // },
});

const SellerModel = mongoose.model("Seller", sellersSchema);

export default SellerModel;
