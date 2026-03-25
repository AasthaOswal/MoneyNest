import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TransactionService from "../../services/transaction.service";

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await TransactionService.getTransactionById(id);
      setForm(res.data);
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await TransactionService.updateTransaction(id, {
      ...form,
      transactionDoc: file
    });

    navigate(`/transactions/${id}`);
  };

  return (
    <div className="bg-bg min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-surface p-6 rounded-xl border border-border">

        <h2 className="text-xl font-semibold text-text mb-4">
          Edit Transaction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input name="title" value={form.title || ""} onChange={handleChange}
            className="w-full p-2 border border-border rounded bg-bg text-text" />

          <input name="amount" value={form.amount || ""} onChange={handleChange}
            className="w-full p-2 border border-border rounded bg-bg text-text" />

          <input type="file" onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-muted" />

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-hover"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTransaction;