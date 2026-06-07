import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryService from "../../services/category.service";
import FilterSelect from "../../components/reusable/FilterSelect";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("active");

  const navigate = useNavigate();

  const CATEGORY_TYPES = [
  { id: "", name: "All Types" },
  { id: "income", name: "Income" },
  { id: "expense", name: "Expense" },
  { id: "investment", name: "Investment" },
];


const STATUS_OPTIONS = [
  { id: "all", name: "All Status" },
  { id: "active", name: "Active" },
  { id: "deleted", name: "Deleted" },
];

  const fetchCategories = async () => {
    try {
      const params = {
        search,
        type,
      };

      if (status === "active") {
        params.isActive = true;
      }

      if (status === "deleted") {
        params.isActive = false;
      }

      const res = await CategoryService.getCategories(params);

      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleClearFilters = async () => {
  setSearch("");
  setType("");
  setStatus("active");

  try {
    const res = await CategoryService.getCategories({
      isActive: true,
    });

    if (res.success) {
      setCategories(res.data);
    }
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          Categories
        </h1>

        <button
          onClick={() => navigate("/categories/create")}
          className="px-4 py-2 rounded-xl bg-primary text-text-on-primary font-semibold w-fit hover:cursor-pointer hover:bg-primary-hover transition-colors">
          + Add Category
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col flex-wrap lg:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 rounded-xl border outline-none"
          style={{
            backgroundColor: "var(--color-input-bg)",
            borderColor: "var(--color-input-border)",
            color: "var(--color-text)",
          }}
        />

        <FilterSelect
          value={type}
          onChange={setType}
          options={CATEGORY_TYPES}
        />


        <FilterSelect
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
        />

        <div className="flex flex-wrap gap-2">
          

          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl  bg-surface-2  border  border-border  text-text  hover:bg-surface-3  transition-colors hover:cursor-pointer"

          >
            Clear Filters
          </button>

          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-xl bg-primary text-text-on-primary font-medium hover:cursor-pointer hover:bg-primary-hover transition-colors">
            Search
          </button>
        </div>


        
      </div>

      {/* Empty State */}
      {categories.length === 0 ? (
        <div
          className="rounded-2xl border p-8 text-center"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
        >
          No categories found.
        </div>
      ) : (
        <div className="grid  sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => navigate(`/categories/${cat._id}`)}
              className="p-5 rounded-2xl border bg-surface cursor-pointer  hover:bg-surface-2 border-border transition-colors"
            >
              {/* Category Name */}
              <div className="flex items-center justify-between gap-2">
                <h2
                  className="text-lg font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  {cat.name}
                </h2>

                {!cat.isActive && (
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: "var(--color-error-bg)",
                      color: "var(--color-error)",
                    }}
                  >
                    Deleted
                  </span>
                )}
              </div>

              {/* Category Type */}
              <div className="mt-3">
                <span
                  className="text-sm px-3 py-1 rounded-full inline-block"
                  style={{
                    backgroundColor:
                      cat.categoryType === "income"
                        ? "var(--color-income-bg)"
                        : cat.categoryType === "expense"
                        ? "var(--color-expense-bg)"
                        : "rgba(216, 180, 254, 0.15)",
                    color: getColor(cat.categoryType),
                  }}
                >
                  {cat.categoryType}
                </span>
              </div>

              {/* Created Date */}
              <div
                className="mt-4 text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Created:{" "}
                {new Date(cat.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;