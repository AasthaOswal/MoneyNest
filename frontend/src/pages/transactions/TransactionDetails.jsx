import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TransactionService from "../../services/transaction.service";

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await TransactionService.getTransactionById(id);
      setTransaction(res.data);
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    await TransactionService.deleteTransaction(id);
    navigate("/transactions/all");
  };

  if (!transaction) return <div className="text-text p-6">Loading...</div>;

  return (
    <div className="bg-bg min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-surface p-6 rounded-xl border border-border">

        <h2 className="text-xl font-semibold text-text mb-4">
          {transaction.title}
        </h2>

        <p className="text-muted mb-2">Amount: ₹ {transaction.amount}</p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigate(`/transactions/edit/${id}`)}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="bg-expense text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;