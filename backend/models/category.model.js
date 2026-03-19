import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family"
  },

  name: String,
  type: {
    type: String,
    enum: ["income", "expense"]
  }
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
