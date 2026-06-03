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

	// can be photo or pdf
	transactionDoc:{
		url : {type : String, },
		publicId: {type : String,},
	}


}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;