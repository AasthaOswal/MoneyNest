import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
	family: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Family",
		required: true
	},

	name: {
		type: String,
		required: true
	},

	categoryType: {
		type: String,
		enum: ["income", "expense", "investment"],
		required: true
	},

	isActive:{
		default:true,
		type:Boolean
	},

	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}

}, { timestamps: true });

// Prevent duplicate categories in same family
categorySchema.index(
    { family: 1, name: 1, categoryType: 1 },
    { unique: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;