import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},

	family: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Family",
		required: true
	},

	type: {
		type: String,
		enum: ["income", "expense", "investment"],
		required: true
	},

	title: { type: String, required: true },


	amount: {
		type: Number,
		required: true,
		min: 0
	},

	// check if we should support multiple categories here because what if we have just paid a food bill, then 2 categories Food and Bills should come here right?
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},


	labels: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Label",
		required : true, //for beetter analytics
	}], //can add multiple labels


	description: String,

	note: String,

	date: {
		type: Date,
		default: Date.now
	},


}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;