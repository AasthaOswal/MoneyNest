import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family"
  },

  type: {
    type: String,
    enum: ["income", "expense", "investment"]
  },

  subType: {
    type: String,
    enum: [
      "earned",
      "one-time",
      "investment-return",
      "regular-expense",
      "investment-out"
    ]
  },

  amount: Number,

  category: {
    type: String
    // groceries, wifi, rent, etc
  },

  label: {
    type: String,
    enum: ["need", "want", "essential", "non-essential"]
  },

  note: String,

  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

transactionSchema.index({ family: 1, date: -1 });
transactionSchema.index({ user: 1 });
transactionSchema.index({ type: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
