import mongoose from "mongoose";
import Category from "../../models/category.model.js";
import Label from "../../models/label.model.js";

export const buildTransactionQuery = async (value, user) => {
  const query = {
    family: user.familyId
  };

  // type
  if (value.type) {
    query.type = value.type;
  }

  // user
  if (value.user?.length) {
    query.user = {
      $in: value.user.map(id => new mongoose.Types.ObjectId(id))
    };
  }

  // category
  if (value.category?.length) {
    query.category = {
      $in: value.category.map(id => new mongoose.Types.ObjectId(id))
    };
  }

  // labels
  if (value.label?.length) {
    query.labels = {
      $in: value.label.map(id => new mongoose.Types.ObjectId(id))
    };
  }

  // amount
  if (value.minAmount || value.maxAmount) {
    query.amount = {};
    if (value.minAmount) query.amount.$gte = value.minAmount;
    if (value.maxAmount) query.amount.$lte = value.maxAmount;
  }

  // date
  if (value.startDate || value.endDate) {
    query.date = {};
    if (value.startDate) query.date.$gte = new Date(value.startDate);
    if (value.endDate) query.date.$lte = new Date(value.endDate);
  }

  // search
  if (value.search) {
    const safeSearch = value.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    query.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { description: { $regex: safeSearch, $options: "i" } },
      { note: { $regex: safeSearch, $options: "i" } }
    ];
  }

  return query;
};