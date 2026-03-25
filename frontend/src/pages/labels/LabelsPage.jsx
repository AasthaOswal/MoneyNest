import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LabelService from "../../services/label.service";

const LabelsPage = () => {
  const [labels, setLabels] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchLabels = async () => {
    try {
      const res = await LabelService.getLabels({ search });
      setLabels(res.data || res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, [search]);

  const handleDelete = async (id) => {
    try {
      await LabelService.deleteLabel(id);
      fetchLabels();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-text">
          Labels
        </h1>
        <button
          onClick={() => navigate("/labels/create")}
          className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition"
        >
          + Create Label
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search labels..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 px-4 py-2 rounded-xl border border-border bg-surface text-text"
      />

      {/* List */}
      <div className="grid gap-4">
        {labels.map((label) => (
          <div
            key={label._id}
            className="p-4 rounded-2xl bg-surface border border-border flex justify-between items-center"
          >
            <span className="text-text font-medium">
              {label.name}
            </span>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/labels/${label._id}`)}
                className="text-sm text-primary"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(label._id)}
                className="text-sm text-expense"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabelsPage;