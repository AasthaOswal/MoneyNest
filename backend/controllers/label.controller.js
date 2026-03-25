import Label from "../models/label.model.js";

// =======================
// ➕ CREATE LABEL
// =======================
export const createLabel = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

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
    console.log("Error in create label:", err);

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
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    const label = await Label.findOneAndUpdate(
      { _id: id, family: req.user.familyId },
      { name },
      { new: true, runValidators: true }
    );

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
    const { search } = req.query;

    let query = {
      family: req.user.familyId
    };

    if (search) {
      query.name = { $regex: search, $options: "i" };
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

    const label = await Label.findOneAndDelete({
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
      message: "Label deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error deleting label"
    });
  }
};