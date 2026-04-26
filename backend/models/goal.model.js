import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["income", "expense", "investment", "saving"],
        required: true
    },

    goalType: {
        type: String,
        enum: ["target", "limit"], 
        // target = reach this amount (income/investment)
        // limit = don't exceed (expense)
        required: true
    },

    goalMode: {
        type: String,
        enum: ["recurring", "custom"],
        default: "recurring"
    }, // later on add  custom goals like from startDate= this to EndDate = this save xyz amount of money

    amount: {
        type: Number,
        required: true
    },

    period: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        required: function () {
            return this.goalMode === "recurring";
        }
    },

	startDate: {
		type: Date,
		required: function () {
			return this.goalMode === "custom";
		}
	},

	endDate: {
		type: Date,
		required: function () {
			return this.goalMode === "custom";
		}
	},

    // WHO OWNS THIS GOAL
    scope: {
        type: String,
        enum: ["family", "individual"],
        required: true
    },

    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function () {
            return this.scope === "individual";
        }
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },


    status: {
        type: String,
        enum: ["active", "completed", "failed"],
        default: "active"
    },

	// if family member wants to keep  their goals private from the family then they can do so
	visibility: {
		type: String,
		enum: ["private", "family"],
		default: "private"
	},

      lastNotifiedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;