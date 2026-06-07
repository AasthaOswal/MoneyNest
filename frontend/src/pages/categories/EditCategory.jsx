import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryService from "../../services/category.service";
import toast from "react-hot-toast";

const EditCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    categoryType: "",
  });

  const fetchCategory = async () => {
    
    const toastId = toast.loading("Fetching category details...");
    try {
      const res = await CategoryService.getCategoryById(id);

      if (res.success) {
        setFormData({
          name: res.data.name,
          categoryType: res.data.categoryType,
        });
        toast.success("Category details fetched.", {id:toastId});
      }
    } catch (err) {
          console.log("FULL ERROR:", err);
  console.log("RESPONSE:", err.response);
  console.log("DATA:", err.response?.data);
      toast.error(err.message || "Some error occured", {id:toastId});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("please wait...");

    try {
      const res = await CategoryService.updateCategory(id, {
        name: formData.name,
      });

      if (res.success) {
        
        toast.success("Category edited succesfully.", {id:toastId});
        navigate(`/categories/${id}`);
      }
    } catch (err) {
        toast.error( err.response?.data?.message || "Something went wrong", {id:toastId} );
    }
  };



  if (loading) {
    return (
      <div className="p-6 text-center text-muted">
        Loading category...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">

      <div className="bg-card border border-border rounded-2xl shadow-card">

        {/* Header */}
        <div className="p-6 border-b border-divider">
          <h1 className="text-2xl font-bold text-text">
            Edit Category
          </h1>

          <p className="text-muted mt-1">
            Update category information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sm text-muted mb-2">
              Category Name
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl bg-input-bg border border-input-border text-text placeholder-placeholder focus:outline-none focus:border-input-focus"
              required
            />
          </div>

          {/* Category Type */}
          <div>
            <label className="block text-sm text-muted mb-2">
              Category Type
            </label>

            <input
              type="text"
              value={formData.categoryType}
              disabled
              className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-border text-muted capitalize cursor-not-allowed"
            />

            <p className="text-xs text-muted mt-2">
              Category type cannot be changed.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">

            <button
              type="button"
              onClick={() => navigate(`/categories/${id}`)}
              className="flex-1 py-3 rounded-xl border border-border text-text hover:bg-surface-2 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary text-text-on-primary font-medium hover:bg-primary-hover transition-colors hover:cursor-pointer"
            >
              Save Changes
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditCategoryPage;