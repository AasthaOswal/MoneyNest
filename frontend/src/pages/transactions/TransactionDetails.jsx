import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TransactionService from "../../services/transaction.service";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      const res = await TransactionService.getTransactionById(id);

      // IMPORTANT FIX
      setTransaction(res.data);
    };
    fetchTransaction();
  }, [id]);

  const handleDelete = async () => {
    await TransactionService.deleteTransaction(id);
    navigate("/transactions");
  };

  if (!transaction)
    return <div className="text-text p-6">Loading...</div>;

  return (
    <div className="bg-bg min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-surface border border-border rounded-2xl p-6 shadow-sm">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-text">
            {transaction.title}
          </h2>

          <button
            onClick={() => navigate("/transactions")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg 
                       bg-primary text-white 
                       hover:bg-primary-hover transition"
          >
            All Transactions
            <ArrowRight size={18} />
          </button>
        </div>

        {/* TYPE BADGE */}
        <div className="mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium 
              border 
              ${
                transaction.type === "income"
                  ? "border-income text-income"
                  : transaction.type === "expense"
                  ? "border-expense text-expense"
                  : "border-investment text-investment"
              }`}
          >
            {transaction.type.toUpperCase()}
          </span>
        </div>

        {/* AMOUNT */}
        <p className="text-xl font-semibold text-text mb-4">
          ₹ {transaction.amount}
        </p>

        {/* DATE */}
        <p className="text-muted mb-4">
          {new Date(transaction.date).toLocaleDateString()}
        </p>

        {/* DESCRIPTION */}
        {transaction.description && (
          <div className="mb-4">
            <p className="text-sm text-muted mb-1">Description</p>
            <p className="text-text">{transaction.description}</p>
          </div>
        )}

        {/* NOTE */}
        {transaction.note && (
          <div className="mb-4">
            <p className="text-sm text-muted mb-1">Note</p>
            <p className="text-text">{transaction.note}</p>
          </div>
        )}

        {/* CATEGORIES */}
        {transaction.category?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-muted mb-2">Categories</p>
            <div className="flex flex-wrap gap-2">
              {transaction.category.map((cat) => (
                <span
                  key={cat._id}
                  className="px-3 py-1 text-sm rounded-full 
                             border border-primary text-primary"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* LABELS */}
        {transaction.labels?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-muted mb-2">Labels</p>
            <div className="flex flex-wrap gap-2">
              {transaction.labels.map((label) => (
                <span
                  key={label._id}
                  className="px-3 py-1 text-sm rounded-full 
                             border border-primary text-primary"
                >
                  {label.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENT IMAGE */}
        {transaction.transactionDoc?.url && (
          <div className="mb-6">
            <p className="text-sm text-muted mb-2">Attachment</p>
            <img
              src={transaction.transactionDoc.url}
              alt="transaction"
              className="rounded-lg border border-border max-h-60 object-cover"
            />
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 pt-4 border-t border-border">

          <button
            onClick={() => navigate(`/transactions/edit/${id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg 
                       bg-primary text-white 
                       hover:bg-primary-hover transition"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-lg 
                       border border-expense text-expense 
                       hover:bg-expense hover:text-white transition"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;