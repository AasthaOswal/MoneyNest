import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LabelService from "../../services/label.service";

const CreateLabel = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await LabelService.createLabel({ name });
      navigate("/labels");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-text">
        Create Label
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-surface p-6 rounded-2xl border border-border space-y-4"
      >
        <input
          type="text"
          placeholder="Label name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border border-border bg-transparent text-text"
          required
        />

        <button
          type="submit"
          className="w-full py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateLabel;