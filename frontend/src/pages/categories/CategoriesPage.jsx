import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryService from "../../services/category.service";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await CategoryService.getCategories({ search, type });

      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories(); // ✅ only initial load
  }, []); // ✅ removed type also

  const handleSearch = () => {
    fetchCategories();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getColor = (type) => {
    if (type === "income") return "var(--color-income)";
    if (type === "expense") return "var(--color-expense)";
    return "var(--color-investment)";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-text">
          Categories
        </h1>

        <button
          onClick={() => navigate("/categories/create")}
          className="px-4 py-2 rounded-xl text-white bg-primary hover:bg-primary-hover transition"
        >
          + Add Category
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 rounded-xl border bg-surface border-border text-text"
        />

        <button
          onClick={handleSearch}
          className="px-4 py-2 rounded-xl text-white bg-primary hover:bg-primary-hover transition"
        >
          Search
        </button>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-surface border-border text-text"
        >
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="investment">Investment</option>
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => navigate(`/categories/${cat._id}`)}
            className="p-4 rounded-2xl border cursor-pointer transition hover:shadow-md bg-surface border-border"
          >
            <h2 className="text-lg font-medium text-text">
              {cat.name}
            </h2>

            <span
              className="text-sm mt-2 inline-block px-2 py-1 rounded-full"
              style={{
                backgroundColor: `${getColor(cat.categoryType)}20`,
                color: getColor(cat.categoryType)
              }}
            >
              {cat.categoryType}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;