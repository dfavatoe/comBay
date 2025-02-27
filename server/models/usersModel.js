import mongoose from "mongoose";

const { Schema } = mongoose;

const usersSchema = Schema(
  {
    _id: Schema.Types.ObjectId,
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    image: { type: String, require: false },
    // cart: { type: Schema.Types.ObjectId, ref: "Cart" },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    }, // Role-based access
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const UserModel = mongoose.model("User", usersSchema);

export default UserModel;
