import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import TransactionService from "../../services/transaction.service";
import api from "../../axios/axios";
import TypeSelect from "../../components/transactions/TypeSelect";
import MultiSelectSheet from "../../components/transactions/MultiSelectSheet";
import SingleSelectSheet from "../../components/transactions/SingleSelectSheet";

const CreateTransaction = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "expense",
    title: "",
    amount: "",
    category: null,
    labels: [],
    description: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchTypeData = async (type) => {
    try {
      const [categoryRes, labelRes] = await Promise.all([
        api.get(`/categories?type=${type}`),
        api.get("/labels"),
      ]);
      setCategories(categoryRes.data.data || []);
      setLabels(labelRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories/labels", err);
    }
  };

  useEffect(() => {
    if (form.type) {
      fetchTypeData(form.type);
    }
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

  const handleCategoryChange = (value) => {
    setForm((prev) => ({ ...prev, category: value }));
  };

  const handleLabelChange = (values) => {
    setForm((prev) => ({ ...prev, labels: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const toastId = toast.loading("Processing transaction...");

    try {
      if (!form.category) {
        throw new Error("Please select a category.");
      }
      if (form.labels.length === 0) {
        throw new Error("Please select at least one label.");
      }

      const response = await TransactionService.createTransaction({
        ...form,
        transactionDoc: file,
      });

      toast.success(response.message || "Transaction recorded!", {id: toastId });

      navigate(`/transactions/${response.data._id}`);
    } catch (err) {
      console.log("FULL ERROR:", err);
      const message = err.response?.data?.message || err.message || "Something went wrong";

      toast.error(message, {id: toastId});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-(--color-bg) px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-(--shadow-card)">
        
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-divider px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text">Create Transaction</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Record a new income, expense, or investment.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/transactions")}
            className="rounded-xl border border-(--color-primary) px-4 py-2 font-medium text-(--color-primary) transition-colors hover:bg-(--color-primary) hover:text-(--color-text-on-primary) cursor-pointer text-sm"
          >
            View Transactions
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-6 rounded-xl border border-(--color-error) bg-(--color-error-bg) px-4 py-3 text-sm text-(--color-error)">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          
          {/* Imported Shared Type Selection Dropdown */}
          <div className="w-full sm:max-w-xs">
            <TypeSelect value={form.type} onChange={handleTypeChange} />
          </div>

          <div className="space-y-5">
            {/* Title Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Title <span className="text-(--color-expense)">*</span>
              </label>
              <input
                required
                name="title"
                value={form.title}
                placeholder="e.g. Monthly Groceries"
                onChange={handleChange}
                className="w-full rounded-xl border border-(--color-input-border) bg-(--color-input-bg) p-3 text-text shadow-sm outline-none transition-all placeholder-placeholder focus:border-(--color-input-focus) focus:ring-1 focus:ring-(--color-input-focus)"
              />
            </div>

            {/* Amount & Date Input Layout */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-text">
                  Amount <span className="text-(--color-expense)">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-3.5 text-muted">
                    ₹
                  </span>
                  <input
                    required
                    name="amount"
                    type="number"
                    min="0"
                    value={form.amount}
                    placeholder="0.00"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-(--color-input-border) bg-(--color-input-bg) py-3 pl-8 pr-3 text-text shadow-sm outline-none transition-all placeholder-placeholder focus:border-(--color-input-focus) focus:ring-1 focus:ring-(--color-input-focus)"
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
                  className="w-full rounded-xl border border-(--color-input-border) bg-(--color-input-bg) p-3 text-text shadow-sm outline-none transition-all focus:border-(--color-input-focus) focus:ring-1 focus:ring-(--color-input-focus)"
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                placeholder="Add some descriptive text..."
                rows="3"
                onChange={handleChange}
                className="w-full resize-none rounded-xl border border-(--color-input-border) bg-(--color-input-bg) p-3 text-text shadow-sm outline-none transition-all placeholder-placeholder focus:border-(--color-input-focus) focus:ring-1 focus:ring-(--color-input-focus)"
              />
            </div>

            {/* Note Textarea */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Note
              </label>
              <textarea
                name="note"
                value={form.note}
                placeholder="Any personal notes?"
                rows="3"
                onChange={handleChange}
                className="w-full resize-none rounded-xl border border-(--color-input-border) bg-(--color-input-bg) p-3 text-text shadow-sm outline-none transition-all placeholder-placeholder focus:border-(--color-input-focus) focus:ring-1 focus:ring-(--color-input-focus)"
              />
            </div>

            {/* File Attachment Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Attachment
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full cursor-pointer rounded-xl border border-(--color-input-border) bg-(--color-input-bg) p-2 text-text shadow-sm file:mr-4 file:rounded-lg file:border-0 file:bg-(--color-surface-2) file:px-4 file:py-2 file:text-sm file:font-medium file:text-text hover:file:bg-surface-3 file:cursor-pointer"
              />
            </div>
          </div>

          {/* Categories & Labels Pickers */}
          <div className="space-y-5 border-t border-divider pt-6">
            
            <SingleSelectSheet
              label="Category"
              title="Select Category"
              options={categories}
              selectedId={form.category}
              onChange={handleCategoryChange}
              placeholder={`Select category for ${form.type || 'transaction'}`}
              emptyText={`No categories found for ${form.type || 'this type'}.`}
              required={true}
            />

            <div className="flex flex-col gap-2 border-b border-divider pb-6 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-text-secondary">
                Please select a category. If no active categories are available, create one first.
              </span>
              <button
                type="button"
                onClick={() => navigate("/categories/create")}
                className="text-sm font-medium text-(--color-primary) hover:text-(--color-primary-hover) cursor-pointer whitespace-nowrap text-left"
              >
                Create Category
              </button>
            </div>

            <MultiSelectSheet
              label="Labels"
              title="Select Labels"
              options={labels}
              selectedIds={form.labels}
              onChange={handleLabelChange}
              placeholder="Select labels"
              emptyText="No labels found."
              required={true}
            />

            <div className="flex flex-col gap-2 border-b border-divider pb-6 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-text-secondary">
                Please select at least one label. If no active labels are available, create one first.
              </span>
              <button
                type="button"
                onClick={() => navigate("/labels/create")}
                className="text-sm font-medium text-(--color-primary) hover:text-(--color-primary-hover) cursor-pointer whitespace-nowrap text-left"
              >
                Create Label
              </button>
            </div>
          </div>

          {/* Form Action Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-8 py-3 font-semibold text-(--color-text-on-primary) shadow-md transition-all hover:bg-(--color-primary-hover) disabled:cursor-not-allowed disabled:opacity-50 md:w-auto cursor-pointer"
            >
              {loading ? "Saving..." : "Save Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTransaction;