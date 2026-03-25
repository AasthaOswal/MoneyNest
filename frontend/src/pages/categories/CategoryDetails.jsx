import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryService from "../../services/category.service";

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
      const res = await CategoryService.updateCategory(id, { name });

      if (res.success) {
        setEditMode(false);
        fetchCategory();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await CategoryService.deleteCategory(id);

      if (res.success) {
        navigate("/categories");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!category) return null;

  return (
    <div className="p-6 max-w-md mx-auto">

      <div className="p-6 rounded-2xl border bg-surface border-border">

        {editMode ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border mb-4 bg-surface border-border text-text"
          />
        ) : (
          <h1 className="text-xl font-semibold text-text">
            {category.name}
          </h1>
        )}

        <p className="mt-2 text-muted">
          Type: {category.categoryType}
        </p>

        <div className="flex gap-3 mt-6">

          {editMode ? (
            <button
              onClick={handleUpdate}
              className="flex-1 py-2 rounded-xl text-white bg-primary"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex-1 py-2 rounded-xl border border-border text-text"
            >
              Edit
            </button>
          )}

          <button
            onClick={handleDelete}
            className="flex-1 py-2 rounded-xl text-white bg-expense"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;