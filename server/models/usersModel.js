import mongoose from "mongoose";

const { Schema } = mongoose;

const usersSchema = Schema(
  {
    userName: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    image: {
      type: String,
      require: false,
      //Other possibility for providing default image
      //default:"https://img.freepik.com/vecteurs-libre/homme-affaires-caractere-avatar-isole_24877-60111.jpg",
    },
    // cart: { type: Schema.Types.ObjectId, ref: "Cart" },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
      require: true,
    }, // Role-based access
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const UserModel = mongoose.model("User", usersSchema);

export default UserModel;
