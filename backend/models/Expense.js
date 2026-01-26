import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: String,
    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "card"],
      default: "cash",
    },
    date: { type: Date, default: Date.now },
    isAutoCategorized: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
