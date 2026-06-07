import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LabelService from "../../services/label.service";
import FilterSelect from "../../components/reusable/FilterSelect";

const LabelsPage = () => {
  const [labels, setLabels] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");

  const STATUS_OPTIONS = [
    { id: "all", name: "All Status" },
    { id: "active", name: "Active" },
    { id: "deleted", name: "Deleted" },
  ];

  const navigate = useNavigate();

const fetchLabels = async () => {
  try {
    const params = {
      search,
    };

    if (status === "active") {
      params.isActive = true;
    }

    if (status === "deleted") {
      params.isActive = false;
    }

    const res = await LabelService.getLabels(params);

    if (res.success) {
      setLabels(res.data);
    }
  } catch (err) {
    toast.error(err.message || "Failed to fetch labels");
  }
};
  useEffect(() => {
    fetchLabels();
  }, []);

  const handleSearch = () => {
    fetchLabels();
  };

const handleClearFilters = async () => {
  setSearch("");
  setStatus("active");

  try {
    const res = await LabelService.getLabels({
      isActive: true,
    });

    if (res.success) {
      setLabels(res.data);
      toast.success("Filters cleared");
    }
  } catch (err) {
    toast.error(err.message || "Failed to fetch labels");
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
  <div>
    <h1 className="text-2xl font-semibold text-text">
      Labels
    </h1>

    <p className="mt-1 text-sm text-text-secondary">
      Total Labels: {labels.length}
    </p>
  </div>

  <button
    onClick={() => navigate("/labels/create")}
    className="px-4 py-2 rounded-xl bg-primary text-text-on-primary font-semibold w-fit hover:bg-primary-hover transition-colors hover:cursor-pointer"
  >
    + Add Label
  </button>
</div>

      {/* Filters */}
      <div className="flex flex-col flex-wrap lg:flex-row gap-4 mb-6">
  <input
    type="text"
    placeholder="Search label..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    onKeyDown={handleKeyDown}
    className="flex-1 px-4 py-2 rounded-xl border border-input-border bg-input-bg text-text outline-none"
  />

  <FilterSelect
    value={status}
    onChange={setStatus}
    options={STATUS_OPTIONS}
  />

  <div className="flex flex-wrap gap-2">
    <button
      onClick={handleClearFilters}
      className="px-4 py-2 rounded-xl bg-surface-2 border border-border text-text hover:bg-surface-3 transition-colors hover:cursor-pointer"
    >
      Clear Filters
    </button>

    <button
      onClick={handleSearch}
      className="px-4 py-2 rounded-xl bg-primary text-text-on-primary font-medium hover:bg-primary-hover transition-colors hover:cursor-pointer"
    >
      Search
    </button>
  </div>
</div>

      {/* Empty State */}
      {labels.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center text-text-secondary">
  No labels found.
</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {labels.map((label) => (
    <div
      key={label._id}
      onClick={() => navigate(`/labels/${label._id}`)}
      className="p-5 rounded-2xl border border-border bg-surface cursor-pointer hover:bg-surface-2 transition-colors"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-medium text-text">
          {label.name}
        </h2>

        {!label.isActive && (
          <span className="text-xs px-2 py-1 rounded-full bg-error-bg text-error">
            Deleted
          </span>
        )}
      </div>

      <div className="mt-3">
        <span className="text-sm px-3 py-1 rounded-full inline-block bg-info-bg text-info">
          Label
        </span>
      </div>

      <div className="mt-4 text-xs text-text-secondary">
        Created: {new Date(label.createdAt).toLocaleDateString()}
      </div>
    </div>
  ))}
</div>
      )}
    </div>
  );
};

export default LabelsPage;