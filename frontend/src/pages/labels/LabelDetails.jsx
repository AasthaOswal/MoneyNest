import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LabelService from "../../services/label.service";

const LabelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [label, setLabel] = useState(null);
  const [name, setName] = useState("");

  const fetchLabel = async () => {
    try {
      const res = await LabelService.getLabelById(id);
      const data = res.data || res;
      setLabel(data);
      setName(data.name);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLabel();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await LabelService.updateLabel(id, { name });
      navigate("/labels");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await LabelService.deleteLabel(id);
      navigate("/labels");
    } catch (err) {
      console.error(err);
    }
  };

  if (!label) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-text">
        Edit Label
      </h1>

      <form
        onSubmit={handleUpdate}
        className="bg-surface p-6 rounded-2xl border border-border space-y-4"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border border-border bg-transparent text-text"
        />

        <button
          type="submit"
          className="w-full py-2 rounded-xl bg-primary text-white hover:bg-primary-hover"
        >
          Update
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="w-full py-2 rounded-xl bg-expense text-white"
        >
          Delete
        </button>
      </form>
    </div>
  );
};

export default LabelDetails;