import mongoose from "mongoose";


const userView = new mongoose.Schema(
  {
    userId: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "User"
    },
    viewDate: {
      type: Date
    },
    productId: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Product",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

userView.index({userId: 1, productId: 1});

const UserView = mongoose.model("UserView", userView);
export default UserView;