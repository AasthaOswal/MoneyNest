import Label from "../models/label.model.js";
import { createLabelSchema } from "../validations/label.validation.js";

// =======================
// ➕ CREATE LABEL
// =======================
export const createLabel = async (req, res) => {
  try {
    // ✅ Joi validation
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
      family: req.user.family,
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
// ❌ DELETE LABEL
// =======================
export const deleteLabel = async (req, res) => {
  try {
    const { id } = req.params;

    const label = await Label.findOneAndDelete({
      _id: id,
      family: req.user.family
    });

    if (!label) {
      return res.status(404).json({
        success: false,
        message: "Label not found"
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