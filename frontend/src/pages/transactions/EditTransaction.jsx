import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TransactionService from "../../services/transaction.service";
import api from "../../axios/axios";
import MultiSelectSheet from "../../components/transactions/MultiSelectSheet";
import SingleSelectSheet from "../../components/transactions/SingleSelectSheet";


const UpdateTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "expense",
    title: "",
    amount: "",
    category: null,
    labels: [],
    description: "",
    note: "",
    date: "",
  });

  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔹 Fetch transaction + categories/labels
  const fetchInitialData = async () => {
    try {
      const txnRes = await TransactionService.getTransactionById(id);
      const txn = txnRes.data;

      setForm({
        type: txn.type,
        title: txn.title,
        amount: txn.amount,
        category: txn.category?._id || txn.category || null,
        labels: txn.labels.map((l) => l._id || l),
        description: txn.description || "",
        note: txn.note || "",
        date: txn.date?.split("T")[0],
      });

      const [categoryRes, labelRes] = await Promise.all([
        api.get(`/categories?type=${txn.type}`),
        api.get("/labels"),
      ]);

      setCategories(categoryRes.data.data || []);
      setLabels(labelRes.data.data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load transaction");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  // 🔹 Refetch categories when type changes
  useEffect(() => {
    const fetchTypeData = async () => {
      try {
        const res = await api.get(`/categories?type=${form.type}`);
        setCategories(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTypeData();
  }, [form.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      type,
      category: null,
      labels: [],
    }));
  };

  const handleCategoryChange = (values) => {
    setForm((prev) => ({ ...prev, category: values }));
  };

  const handleLabelChange = (values) => {
    setForm((prev) => ({ ...prev, labels: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await TransactionService.updateTransaction(id, {
        ...form,
        transactionDoc: file,
      });
      console.log(response)

      navigate(`/transactions/${response.data._id}`);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || err.message || "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="p-6 text-center text-muted">Loading...</div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-surface shadow-sm">

        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text">
              Update Transaction
            </h2>
            <p className="mt-1 text-sm text-muted">
              Edit your transaction details.
            </p>
          </div>

          <button
            onClick={() => navigate("/transactions")}
            className="rounded-xl border border-primary px-4 py-2 text-primary hover:bg-primary hover:text-white"
          >
            Back
          </button>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mx-6 mt-6 rounded-xl border border-expense px-4 py-3 text-expense">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">

          {/* Type */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {["expense", "income", "investment"].map((type) => (
              <label
                key={type}
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  form.type === type
                    ? type === "expense"
                      ? "border-expense bg-surface text-expense"
                      : type === "income"
                      ? "border-income bg-surface text-income"
                      : "border-investment bg-surface text-investment"
                    : "border-border bg-bg text-muted hover:border-primary hover:text-text"
                }`}
              >
                <input
                  type="radio"
                  checked={form.type === type}
                  onChange={() => handleTypeChange(type)}
                  className="hidden"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>

          <div className="space-y-5">

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Title <span className="text-expense">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                placeholder="e.g. Grocery shopping"
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-bg p-3 text-text shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Amount + Date */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-text">
                  Amount <span className="text-expense">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-muted">₹</span>
                  <input
                    name="amount"
                    type="number"
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-bg py-3 pl-8 pr-3 text-text shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-bg p-3 text-text shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                rows="3"
                placeholder="Add some details..."
                onChange={handleChange}
                className="w-full resize-none rounded-xl border border-border bg-bg p-3 text-text shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Note */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Note
              </label>
              <textarea
                name="note"
                value={form.note}
                rows="3"
                placeholder="Optional note..."
                onChange={handleChange}
                className="w-full resize-none rounded-xl border border-border bg-bg p-3 text-text shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* File */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Attachment
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full cursor-pointer rounded-xl border border-border bg-bg p-2 text-text shadow-sm file:mr-4 file:rounded-lg file:border-0 file:bg-surface file:px-4 file:py-2 file:text-sm file:font-medium file:text-text hover:file:bg-border"
              />
            </div>

          </div>

          {/* Category + Labels */}
          <div className="space-y-5 border-t border-border pt-6">
            <SingleSelectSheet
              label="Category"
              title="Select Category"
              options={categories}
              selectedId={form.category}
              onChange={handleCategoryChange}
              placeholder={`Select category for ${form.type}`}
              emptyText={`No categories found for ${form.type}.`}
            />

            <MultiSelectSheet
              label="Labels"
              title="Select Labels"
              options={labels}
              selectedIds={form.labels}
              onChange={handleLabelChange}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 text-white hover:bg-primary-hover"
          >
            {loading ? "Updating..." : "Update Transaction"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default UpdateTransaction; 