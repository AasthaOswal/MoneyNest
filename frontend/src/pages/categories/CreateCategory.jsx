import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryService from "../../services/category.service";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [categoryType, setCategoryType] = useState("expense");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await CategoryService.createCategory({
        name,
        categoryType
      });

      if (res.success) {
        navigate("/categories");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">

      <h1 className="text-2xl font-semibold mb-6 text-text">
        Create Category
      </h1>

      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-2xl border bg-surface border-border space-y-4"
      >
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border bg-surface border-border text-text"
        />

        <select
          value={categoryType}
          onChange={(e) => setCategoryType(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border bg-surface border-border text-text"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="investment">Investment</option>
        </select>

        <button
          type="submit"
          className="w-full py-2 rounded-xl text-white bg-primary hover:bg-primary-hover"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;