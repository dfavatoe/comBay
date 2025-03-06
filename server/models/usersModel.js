import mongoose, { mongo } from "mongoose";

const { Schema } = mongoose;

const usersSchema = Schema(
  {
    userName: {
      type: String,
      require: true,
      validate: {
        validator: function (v) {
          return v.length > 2;
        },
        message: `User name {VALUE} should be longer than 2 characters!`,
      },
    },
    email: { type: String, require: true, unique: true },
    password: {
      type: String,
      require: true,
      // minLength: [6, "Must be at least 6"],
    },

    image: {
      type: String,
      require: false,
      //Other possibility for providing default image
      // default:
      //   "https://img.freepik.com/vecteurs-libre/homme-affaires-caractere-avatar-isole_24877-60111.jpg",
    },
    // cart: { type: Schema.Types.ObjectId, ref: "Cart" },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
      require: true,
    }, // Role-based access
    productsList: Array,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const UserModel = mongoose.model("User", usersSchema);

export default UserModel;
