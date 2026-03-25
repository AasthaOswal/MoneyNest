import { useEffect, useState } from "react";
import TransactionService from "../../services/transaction.service";
import api from "../../axios/axios";
import { useNavigate } from "react-router-dom";

const CreateTransaction = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "expense",
    title: "",
    amount: "",
    category: [],
    labels: [],
    description: "",
    note: "",
    date: new Date().toISOString().split("T")[0]
  });

  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch labels once
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const res = await api.get("/labels");
        setLabels(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch labels", err);
      }
    };
    fetchLabels();
  }, []);

  // Fetch categories when type changes
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(`/categories?type=${form.type}`);
        setCategories(res.data.data || []);
        // Reset selected categories since they might not be valid for the new type
        setForm(prev => ({ ...prev, category: [] }));
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, [form.type]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleCategory = (id) => {
    setForm(prev => {
      const isSelected = prev.category.includes(id);
      if (isSelected) return { ...prev, category: prev.category.filter(c => c !== id) };
      return { ...prev, category: [...prev.category, id] };
    });
  };

  const toggleLabel = (id) => {
    setForm(prev => {
      const isSelected = prev.labels.includes(id);
      if (isSelected) return { ...prev, labels: prev.labels.filter(c => c !== id) };
      return { ...prev, labels: [...prev.labels, id] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (form.category.length === 0) throw new Error("Please select at least one category.");
      if (form.labels.length === 0) throw new Error("Please select at least one label.");

      const response = await TransactionService.createTransaction({
        ...form,
        transactionDoc: file
      });
      navigate(`/transactions/${response.data.data._id}`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg min-h-[calc(100vh-64px)] p-4 md:p-8 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-surface p-6 md:p-8 rounded-2xl shadow-sm border border-border">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-4 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-text">Create Transaction</h2>
            <p className="text-muted text-sm mt-1">Record a new income, expense, or investment.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/transactions/all")}
            className="bg-transparent border border-primary text-primary px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-colors duration-200 font-medium"
          >
            View Transactions
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Type Selection */}
          <div className="grid grid-cols-3 gap-4">
            {["expense", "income", "investment"].map(type => (
              <label 
                key={type} 
                className={`flex justify-center items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  form.type === type 
                    ? type === "expense" ? "bg-red-50 border-expense text-expense font-medium" 
                      : type === "income" ? "bg-green-50 border-income text-income font-medium"
                      : "bg-purple-50 border-investment text-investment font-medium"
                    : "border-border text-muted hover:bg-bg"
                }`}
              >
                <input 
                  type="radio" 
                  name="type" 
                  value={type} 
                  checked={form.type === type} 
                  onChange={handleChange} 
                  className="hidden"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Title <span className="text-red-500">*</span></label>
                <input required name="title" value={form.title} placeholder="e.g. Monthly Groceries" onChange={handleChange}
                  className="w-full p-3 border border-border rounded-xl bg-bg text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Amount <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-muted">₹</span>
                  <input required name="amount" type="number" min="0" value={form.amount} placeholder="0.00" onChange={handleChange}
                    className="w-full pl-8 p-3 border border-border rounded-xl bg-bg text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange}
                  className="w-full p-3 border border-border rounded-xl bg-bg text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Description</label>
                <textarea name="description" value={form.description} placeholder="Add some descriptive text..." rows="2"
                  onChange={handleChange}
                  className="w-full p-3 border border-border rounded-xl bg-bg text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Note</label>
                <textarea name="note" value={form.note} placeholder="Any personal notes?" rows="2"
                  onChange={handleChange}
                  className="w-full p-3 border border-border rounded-xl bg-bg text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Attachment</label>
                <input type="file" onChange={(e) => setFile(e.target.files[0])}
                  className="w-full p-2 border border-border rounded-xl bg-bg text-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-surface file:text-text hover:file:bg-border transition-colors cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-border">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                Categories <span className="text-red-500">*</span>
                <span className="text-xs text-muted font-normal block">(Select 1 or more)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.length === 0 ? (
                  <span className="text-muted text-sm italic">No categories found for {form.type}.</span>
                ) : (
                  categories.map(c => {
                    const isSelected = form.category.includes(c._id);
                    return (
                      <button
                        key={c._id}
                        type="button"
                        onClick={() => toggleCategory(c._id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                          isSelected 
                            ? "bg-primary text-white border-primary shadow-sm scale-105" 
                            : "bg-bg text-text border-border hover:border-muted"
                        }`}
                      >
                        {c.name}
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Labels */}
            <div>
              <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                Labels <span className="text-red-500">*</span>
                <span className="text-xs text-muted font-normal block">(Select 1 or more)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {labels.length === 0 ? (
                  <span className="text-muted text-sm italic">No labels found.</span>
                ) : (
                  labels.map(l => {
                    const isSelected = form.labels.includes(l._id);
                    return (
                      <button
                        key={l._id}
                        type="button"
                        onClick={() => toggleLabel(l._id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                          isSelected 
                            ? "bg-text text-surface border-text shadow-sm scale-105" 
                            : "bg-bg text-text border-border hover:border-muted"
                        }`}
                      >
                        {l.name}
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                 <span>Saving...</span>
              ) : (
                 <span>Save Transaction</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateTransaction;