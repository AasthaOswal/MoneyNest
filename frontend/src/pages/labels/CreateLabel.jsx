import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LabelService from "../../services/label.service";

const CreateLabel = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading(
      "Creating label. Please wait..."
    );

    try {
      const res = await LabelService.createLabel({
        name,
      });

      if (res.success) {
        toast.success(
          "Label created successfully",
          {
            id: toastId,
          }
        );

        navigate("/labels");
      }
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Some error occured.",
        {
          id: toastId,
        }
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-divider">
          <h1 className="text-3xl font-bold text-text">
            Create Label
          </h1>

          <p className="text-muted mt-2">
            Add a new label to organize your
            transactions.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">

            <div>
              <label className="block text-sm text-muted mb-2">
                Label Name
              </label>

              <input
                type="text"
                placeholder="Enter label name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl bg-input-bg border border-input-border text-text focus:outline-none focus:border-input-focus"
                required
              />
            </div>

          </div>

          {/* Actions */}
          <div className="p-6 border-t border-divider flex gap-3">

            <button
              type="button"
              onClick={() => navigate("/labels")}
              className="flex-1 py-3 rounded-xl border border-border text-text font-medium hover:bg-surface transition-colors hover:cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary text-text-on-primary font-medium hover:bg-primary-hover transition-colors hover:cursor-pointer"
            >
              Create Label
            </button>

          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateLabel;