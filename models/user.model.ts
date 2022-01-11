import mongoose from "mongoose";


const user = new mongoose.Schema(
  {
    id: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", user);
export default User;