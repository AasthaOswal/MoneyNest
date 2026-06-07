import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryService from "../../services/category.service";
import toast from "react-hot-toast";

const CategoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");

  const fetchCategory = async () => {
    try {
      const res = await CategoryService.getCategoryById(id);

      if (res.success) {
        setCategory(res.data);
        setName(res.data.name);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await CategoryService.updateCategory(id, {
        name,
      });

      if (res.success) {
        setEditMode(false);
        fetchCategory();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting category. Please wait...");
    try {
      const res = await CategoryService.deleteCategory(id);

      if (res.success) {
        toast.success("Category deleted successfully", {id:toastId});
        navigate("/categories");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Some error occured.", {id:toastId});
    }
  };

  if (!category) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">


      {/* Card */}
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">

        {/* Top Section */}
        <div className="p-6 border-b border-divider">

            <h1 className="text-3xl font-bold text-text">
              {category.name}
            </h1>
          
          <div className="flex flex-wrap gap-3 mt-4">

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium
                ${
                  category.categoryType === "income"
                    ? "bg-income-bg text-income"
                    : category.categoryType === "expense"
                    ? "bg-expense-bg text-expense"
                    : "bg-investment-bg text-investment"
                }
              `}
            >
              {category.categoryType}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium
                ${
                  category.isActive
                    ? "bg-success-bg text-success"
                    : "bg-error-bg text-error"
                }
              `}
            >
              {category.isActive ? "Active" : "Deleted"}
            </span>

          </div>
        </div>

        {/* Details */}
        <div className="p-6">

          <div className="grid sm:grid-cols-2 gap-6">



            <div>
              <p className="text-muted text-sm mb-1">
                Category Type
              </p>

              <p className="text-text capitalize">
                {category.categoryType}
              </p>
            </div>

            <div>
              <p className="text-muted text-sm mb-1">
                Status
              </p>

              <p className="text-text">
                {category.isActive
                  ? "Active"
                  : "Deleted (Soft Deleted)"}
              </p>
            </div>

            <div>
              <p className="text-muted text-sm mb-1">
                Created By
              </p>

              <p className="text-text">
                {category.createdBy?.name || "N/A"}
              </p>

            </div>

            <div>
              <p className="text-muted text-sm mb-1">
                Created On
              </p>

              <p className="text-text">
                {new Date(
                  category.createdAt
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-muted text-sm mb-1">
                Last Updated
              </p>

              <p className="text-text">
                {new Date(
                  category.updatedAt
                ).toLocaleString()}
              </p>
            </div>

          </div>

        </div>

        {/* Actions */}
        <div className="p-6 border-t border-divider flex flex-wrap flex-row gap-3">
          <button
            onClick={handleDelete}
            className="flex-1 py-3 rounded-xl bg-expense text-text-on-primary font-medium hover:opacity-90 transition-colors hover:cursor-pointer"
          >
            Delete Category
          </button>

          <button
            onClick={() => navigate(`/categories/${id}/edit`)}
            className="flex-1 py-3 rounded-xl bg-primary text-text-on-primary font-medium hover:bg-primary-hover transition-colors hover:cursor-pointer"
          >
            Edit Category
          </button>



        </div>

      </div>
    </div>
  );
};

export default CategoryDetails;