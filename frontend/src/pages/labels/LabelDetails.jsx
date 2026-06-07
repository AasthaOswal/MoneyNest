import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LabelService from "../../services/label.service";
import toast from "react-hot-toast";

const LabelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [label, setLabel] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");

  const fetchLabel = async () => {
    try {
      const res = await LabelService.getLabelById(id);

      // Adaptable checking for standard API responses or raw payloads
      const data = res.success ? res.data : (res.data || res);
      
      if (data) {
        setLabel(data);
        setName(data.name);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLabel();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await LabelService.updateLabel(id, { name });

      // Support either response wrapper architecture smoothly
      if (res.success || res) {
        setEditMode(false);
        fetchLabel();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting label. Please wait...");
    try {
      const res = await LabelService.deleteLabel(id);

      if (res.success || res) {
        toast.success("Label deleted successfully", { id: toastId });
        navigate("/labels");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Some error occurred.", { id: toastId });
    }
  };

  if (!label) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      
      {/* Card Wrapper */}
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">

        {/* Top Header Section */}
        <div className="p-6 border-b border-divider">
            <h1 className="text-3xl font-bold text-text">
              {label.name}
            </h1>
          

          <div className="flex flex-wrap gap-3 mt-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                label.isActive
                  ? "bg-success-bg text-success"
                  : "bg-error-bg text-error"
              }`}
            >
              {label.isActive ? "Active" : "Deleted (Soft Deleted)"}
            </span>
          </div>
        </div>

        {/* Info/Meta Details Grid */}
        <div className="p-6">
          <div className="grid sm:grid-cols-2 gap-6">
            
            <div>
              <p className="text-muted text-sm mb-1">Label Name</p>
              <p className="text-text">{label.name}</p>
            </div>

            <div>
              <p className="text-muted text-sm mb-1">Status</p>
              <p className="text-text">
                {label.isActive ? "Active" : "Deleted (Soft Deleted)"}
              </p>
            </div>

            <div>
              <p className="text-muted text-sm mb-1">Created By</p>
              <p className="text-text">
                {label.createdBy?.name || "N/A"}
              </p>
            </div>

            {label.createdAt && (
              <div>
                <p className="text-muted text-sm mb-1">Created On</p>
                <p className="text-text">
                  {new Date(label.createdAt).toLocaleString()}
                </p>
              </div>
            )}

            {label.updatedAt && (
              <div>
                <p className="text-muted text-sm mb-1">Last Updated</p>
                <p className="text-text">
                  {new Date(label.updatedAt).toLocaleString()}
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Form CTA Actions Footer */}
        <div className="p-6 border-t border-divider flex flex-wrap flex-row gap-3">
          <button
            onClick={handleDelete}
            className="flex-1 py-3 rounded-xl bg-expense text-text-on-primary font-medium hover:opacity-90 transition-colors hover:cursor-pointer"
          >
            Delete Label
          </button>

        
            <button
              onClick={() => navigate(`/labels/${id}/edit`)}
              className="flex-1 py-3 rounded-xl bg-primary text-text-on-primary font-medium hover:bg-primary-hover transition-colors hover:cursor-pointer"
            >
              Edit Label
            </button>

        </div>

      </div>
    </div>
  );
};

export default LabelDetails;