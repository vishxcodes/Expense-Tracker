import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: { type: String, required: true },
    monthlyLimit: { type: Number, required: true },
    month: Number,
    year: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Budget", budgetSchema);
