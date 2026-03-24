import Category from "../models/category.model.js";
import { createCategorySchema } from "../validations/category.validation.js";

// =======================
// ➕ CREATE CATEGORY
// =======================
export const createCategory = async (req, res) => {
  try {
    // ✅ Joi validation
    const { value, error } = createCategorySchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, categoryType } = value;

    const category = await Category.create({
      name,
      categoryType,
      family: req.user.family,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      data: category
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category already exists in this family"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error creating category"
    });
  }
};


// =======================
// ❌ DELETE CATEGORY
// =======================
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOneAndDelete({
      _id: id,
      family: req.user.family
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    return res.json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error deleting category"
    });
  }
};