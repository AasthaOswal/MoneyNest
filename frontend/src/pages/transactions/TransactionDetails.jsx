import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TransactionService from "../../services/transaction.service";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  Tag,
  FileText,
  StickyNote,
  Plus,
  List,
} from "lucide-react";

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      const res = await TransactionService.getTransactionById(id);
      setTransaction(res.data);
      const fileUrl = res.data?.transactionDoc?.url;

      const isPdfResult = fileUrl?.toLowerCase().includes(".pdf");
      setIsPdf(isPdfResult);
    };

    fetchTransaction();
  }, [id]);

  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting transaction...");

    try {
      const res = await TransactionService.deleteTransaction(id);

      toast.success(
        res?.message || "Transaction deleted successfully",
        { id: loadingToast }
      );

      navigate("/transactions");
    } catch (error) {
      toast.error(
        error?.response.data.message || "Failed to delete transaction",
        { id: loadingToast }
      );
    }
  };

  if (!transaction) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-secondary">Loading transaction...</p>
      </div>
    );
  }

  const badgeStyles = {
    income:
      "bg-income-bg text-income border border-income/30",
    expense:
      "bg-expense-bg text-expense border border-expense/30",
    investment:
      "bg-investment-bg text-investment border border-investment/30",
  };

  return (
    <div className="min-h-screen bg-bg p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
      

        {/* Main Card */}
        <div
          className="bg-card border border-border rounded-3xl overflow-hidden"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-divider">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
              <div>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    badgeStyles[transaction.type]
                  }`}
                >
                  {transaction.type?.toUpperCase()}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-text mb-3">
                  {transaction.title}
                </h1>

                <p className="text-3xl font-bold text-primary">
                  ₹ {Number(transaction.amount).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Date */}
            <div className="flex items-start gap-3">
              <Calendar
                size={18}
                className="text-primary mt-1 shrink-0"
              />
              <div>
                <p className="text-sm text-muted">Transaction Date</p>
                <p className="text-text">
                  {new Date(transaction.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Category */}
            {transaction.category && (
              <div className="flex items-start gap-3">
                <Tag
                  size={18}
                  className="text-primary mt-1 shrink-0"
                />
                <div>
                  <p className="text-sm text-muted">Category</p>
                  <p className="text-text">
                    {transaction.category.name}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            {transaction.description && (
              <div className="flex items-start gap-3">
                <FileText
                  size={18}
                  className="text-primary mt-1 shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm text-muted mb-1">
                    Description
                  </p>

                  <div className="bg-surface-2 border border-border rounded-xl p-4">
                    <p className="text-text whitespace-pre-wrap">
                      {transaction.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Note */}
            {transaction.note && (
              <div className="flex items-start gap-3">
                <StickyNote
                  size={18}
                  className="text-primary mt-1 shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm text-muted mb-1">
                    Note
                  </p>

                  <div className="bg-surface-2 border border-border rounded-xl p-4">
                    <p className="text-text whitespace-pre-wrap">
                      {transaction.note}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Labels */}
            {transaction.labels?.length > 0 && (
              <div>
                <p className="text-sm text-muted mb-3">Labels</p>

                <div className="flex flex-wrap gap-2">
                  {transaction.labels.map((label) => (
                    <span
                      key={label._id}
                      className="px-3 py-1.5 rounded-full text-sm bg-primary-subtle text-primary border border-primary/20"
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Attachment */}
            {transaction.transactionDoc?.url && (
              
              <div>
                <p className="text-sm text-muted mb-3">
                  Attachment
                </p>
                {isPdf ? (
                  <div className="bg-surface-2 border border-border rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text">
                        PDF Document
                      </p>
                      <p className="text-sm text-muted">
                        Click below to view the file
                      </p>
                    </div>

                  </div>
                ) : 
                (
                  <div className="bg-surface-2 border border-border rounded-2xl p-3">
                    <img
                      src={transaction.transactionDoc.url}
                      alt="Transaction Document"
                      className="w-full max-h-72 object-contain rounded-xl"
                      onClick={() =>
                      window.open(transaction.transactionDoc.url, "_blank")} />
                  </div>
                ) }
                            
                <button
                  onClick={() =>
                    window.open(transaction.transactionDoc.url, "_blank")
                  }
                  className="mt-3 text-sm text-primary hover:underline hover:cursor-pointer"
                >
                  View Full Image/doc
                </button>
              </div>
            )}

            <div className="pt-6 border-t border-divider">
              <h3 className="text-sm font-medium text-muted mb-3">
                Actions
              </h3>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/transactions")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 border border-border text-text hover:bg-surface-3 transition-colors hover:cursor-pointer"
                >
                  <List size={16} />
                  All Transactions
                </button>

                <button
                  onClick={() => navigate("/transactions/create")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-subtle text-primary border border-primary/20 hover:bg-primary/10 transition-colors hover:cursor-pointer"
                >
                  <Plus size={16} />
                  Create Transaction
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-error text-error hover:bg-error-bg transition-colors hover:cursor-pointer"
                >
                  <Trash2 size={16} />
                  Delete
                </button>

                <button
                  onClick={() =>
                    navigate(`/transactions/edit/${transaction._id}`)
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-text-on-primary hover:bg-primary-hover transition-colors hover:cursor-pointer"
                >
                  <Pencil size={16} />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;