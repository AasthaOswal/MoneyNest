import Category from "../models/category.model.js";
import { createCategorySchema } from "../validators/category.validation.js";

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
      family: req.user.familyId,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      data: category
    });

  } catch (err) {
    console.log("Error in create category controller : ", err);
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
// ✏️ UPDATE CATEGORY
// =======================
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    const category = await Category.findOneAndUpdate(
      { _id: id, family: req.user.familyId },
      { name },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    return res.json({
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
      message: "Error updating category"
    });
  }
};

// =======================
// 📋 GET ALL CATEGORIES
// =======================
export const getCategories = async (req, res) => {
  try {
    const { search, type } = req.query;

    let query = {
      family: req.user.familyId
    };

    if (type) {
      query.categoryType = type;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const categories = await Category.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching categories"
    });
  }
};


// =======================
// 🔍 GET CATEGORY BY ID
// =======================
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      _id: id,
      family: req.user.familyId
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    return res.json({
      success: true,
      data: category
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching category"
    });
  }
};


// =======================
// ❌ DELETE CATEGORY
// =======================
//if a category is deleted its corresponsing transactions will be deleted as well --this needs to be implemented
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOneAndDelete({
      _id: id,
      family: req.user.familyId
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

