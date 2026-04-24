import Label from "../models/label.model.js";
import { createLabelSchema, updateLabelSchema, getLabelsSchema } from "../validators/label.validation.js";
import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";



export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


// =======================
// ➕ CREATE LABEL
// =======================
export const createLabel = async (req, res) => {
  try {
    const { value, error } = createLabelSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name } = value;

    const label = await Label.create({
      name,
      family: req.user.familyId,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      data: label
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Label already exists in this family"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error creating label"
    });
  }
};



// =======================
// ✏️ UPDATE LABEL
// =======================
export const updateLabel = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid label ID"
      });
    }

    const { value, error } = updateLabelSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    if (!Object.keys(value).length) {
      return res.status(400).json({
        success:false,
        message: "No fields to update"
      });
    }

    const label = await Label.findOneAndUpdate(
      {
        _id: id,
        family: req.user.familyId,
        createdBy: req.user._id,   // ✅ ownership check
        isActive:true
      },
      value,
      { new: true, runValidators: true }
    );

    if (!label) {
      return res.status(404).json({
        success: false,
        message: "Label not found or unauthorized"
      });
    }

    return res.json({
      success: true,
      data: label
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Label already exists in this family"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error updating label"
    });
  }
};


// =======================
// 📋 GET ALL LABELS
// =======================
export const getLabels = async (req, res) => {
  try {
    const { value, error } = getLabelsSchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { search } = value;

    let query = {
      family: req.user.familyId
    };

    if (search) {
      const escapedSearch = escapeRegex(search);
      query.name = { $regex: escapedSearch, $options: "i" };
    }

    const labels = await Label.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: labels.length,
      data: labels
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching labels"
    });
  }
};


// =======================
// 🔍 GET LABEL BY ID
// =======================
export const getLabelById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid label ID"
      });
    }

    const label = await Label.findOne({
      _id: id,
      family: req.user.familyId
    });

    if (!label) {
      return res.status(404).json({
        success: false,
        message: "Label not found"
      });
    }

    return res.json({
      success: true,
      data: label
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching label"
    });
  }
};


// =======================
// ❌ DELETE LABEL
// =======================

export const deleteLabel = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid label ID"
      });
    }

    const label = await Label.findOneAndUpdate(
      {
        _id: id,
        family: req.user.familyId,
        createdBy: req.user._id, //ownership check
        isActive: true   //prevent re-delete
      },
      {
        isActive: false
      },
      {
        new: true
      }
    );

    if (!label) {
      return res.status(404).json({
        success: false,
        message: "Label not found or unauthorized"
      });
    }


    return res.json({
      success: true,
      message: "Label deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error deleting label"
    });
  }
};