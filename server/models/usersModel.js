import mongoose from "mongoose";

const { Schema } = mongoose;

const usersSchema = Schema(
  {
    _id: Schema.Types.ObjectId,
    uName: { type: String, require: true },
    uEmail: { type: String, require: true },
    uPassword: { type: String, require: true },
    uAvatar: { type: String, require: false },
    cart: { type: Schema.Types.ObjectId, ref: "Cart" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const UserModel = mongoose.model("User", usersSchema);

export default UserModel;
