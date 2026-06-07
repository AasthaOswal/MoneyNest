import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import CategoryService from "../../services/category.service";
import FilterSelect from "../../components/reusable/FilterSelect";

const CATEGORY_TYPES = [
  { id: "income", name: "Income" },
  { id: "expense", name: "Expense" },
  { id: "investment", name: "Investment" },
];

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [categoryType, setCategoryType] = useState("expense");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await CategoryService.createCategory({
        name,
        categoryType,
      });

      if (res.success) {
        toast.success(res.message || "Category created successfully");
        navigate("/categories");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to create category"
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form onSubmit={handleSubmit}>
        <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-divider">
            <h1 className="text-3xl font-bold text-text">
              Create Category
            </h1>

            <p className="text-muted mt-2">
              Add a new category for transactions.
            </p>
          </div>

          {/* Form Details */}
          <div className="p-6">
            <div className="flex flex-col gap-6">
              
              {/* Category Name */}
              <div className="sm:col-span-2">
                <p className="text-muted text-sm mb-1">
                  Category Name
                </p>

                <input
                  type="text"
                  placeholder="Enter category name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-input-bg border border-input-border text-text focus:outline-none focus:border-input-focus"
                />
              </div>

              {/* Category Type */}
              <div>
                <p className="text-muted text-sm mb-1">
                  Category Type
                </p>

                <FilterSelect
                  value={categoryType}
                  onChange={setCategoryType}
                  options={CATEGORY_TYPES}
                />
              </div>

              
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-divider flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/categories")}
              className="flex-1 py-3 rounded-xl border border-border bg-surface text-text font-medium hover:opacity-90 transition-colors hover:cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary text-text-on-primary font-medium hover:bg-primary-hover transition-colors hover:cursor-pointer"
            >
              Create Category
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default CreateCategory;