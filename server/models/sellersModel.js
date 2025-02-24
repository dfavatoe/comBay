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
  s_name: { type: String, require: true },
  s_email: { type: String, require: true },
  s_url: String,
  s_address: { type: String, require: true },
  geo: {
    lat: { type: Number, require: true },
    lon: { type: Number, require: true },
    pluscode: { type: String },
  },
  s_products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  // geo: {
  //   geo: {
  //     type: geoSchema,
  //   },
  // },
});

const SellerModel = mongoose.model("Seller", sellersSchema);

export default SellerModel;
