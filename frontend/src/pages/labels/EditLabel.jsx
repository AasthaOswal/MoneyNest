import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LabelService from "../../services/label.service"; // Adjust path as necessary
import toast from "react-hot-toast";

const EditLabel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
  });

  const fetchLabel = async () => {
    const toastId = toast.loading("Fetching label details...");
    try {
      // LabelService returns the raw data payload as designed in your API utility
      const res = await LabelService.getLabelById(id);

      // Assuming your standard API response wrapper contains a success flag or direct data
      if (res.success || res.data) {
        const labelData = res.data || res;
        setFormData({
          name: labelData.name,
        });
        toast.success("Label details fetched.", { id: toastId });
      }
    } catch (err) {
      console.log("FULL ERROR:", err);
      toast.error(err.message || "Some error occurred", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabel();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Please wait...");

    try {
      const res = await LabelService.updateLabel(id, {
        name: formData.name,
      });

      if (res.success || res.data) {
        toast.success("Label edited successfully.", { id: toastId });
        navigate(`/labels/${id}`);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div 
        className="p-6 text-center" 
        style={{ color: "var(--color-muted)" }}
      >
        Loading label...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div 
        className="rounded-2xl"
        style={{
          backgroundColor: "var(--color-card)",
          borderColor: "var(--color-border)",
          borderWidth: "1px",
          borderStyle: "solid",
          boxShadow: "var(--shadow-card)"
        }}
      >
        {/* Header */}
        <div 
          className="p-6"
          style={{ 
            borderBottom: "1px solid var(--color-divider)" 
          }}
        >
          <h1 
            className="text-2xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            Edit Label
          </h1>

          <p 
            className="mt-1 text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            Update label information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Label Name */}
          <div>
            <label 
              className="block text-sm mb-2"
              style={{ color: "var(--color-muted)" }}
            >
              Label Name
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
              className="w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
              style={{
                backgroundColor: "var(--color-input-bg)",
                borderColor: "var(--color-input-border)",
                borderWidth: "1px",
                borderStyle: "solid",
                color: "var(--color-text)",
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--color-input-focus)"}
              onBlur={(e) => e.target.style.borderColor = "var(--color-input-border)"}
              placeholder="Enter label name"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/labels/${id}`)}
              className="flex-1 py-3 rounded-xl border transition-colors cursor-pointer"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text)"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "var(--color-surface-2)"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-on-primary)"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "var(--color-primary-hover)"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "var(--color-primary)"}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLabel;