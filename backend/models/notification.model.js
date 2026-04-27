import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: String,
  body: String,

  type: {
    type: String,
    enum: [
      "goal_alert",
      "transaction",
      "system",
      "family",
      "reminder",
      "report",
      "notification"
    ],
  },

  isRead: {
    type: Boolean,
    default: false,
  },

  data: {
    type: Object, // optional extra info (goalId, transactionId, etc.)
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});



const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;