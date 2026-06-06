import React, { useState, useEffect } from "react";
import TransactionService from "../../services/transaction.service";
import LabelService from "../../services/label.service";
import CategoryService from "../../services/category.service";
import FamilyService from "../../services/family.service";
import { useNavigate } from "react-router-dom";
import MultiSelectSheet from "../../components/transactions/MultiSelectSheet";
import SingleSelectSheet from "../../components/transactions/SingleSelectSheet";
import TypeSelect from "../../components/transactions/TypeSelect";
import toast from "react-hot-toast";
import {
  setupTransactionListeners,
  removeTransactionListeners,
} from "../../socket/socketTransaction";

import {
  Plus,
  Search,
  RotateCcw,
  Download,
  Mail,
  CalendarDays,
  Receipt,
} from "lucide-react";

const TransactionsList = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState(null); // null means hasn't searched yet
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [summary, setSummary] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
    category: null,
    label: [],
    user: []
  });

  const applyQuickFilter = (type) => {
    const now = new Date();
    let start;

    if (type === "1m") {
      start = new Date();
      start.setMonth(now.getMonth() - 1);
    }

    if (type === "3m") {
      start = new Date();
      start.setMonth(now.getMonth() - 3);
    }

    setFilters({
      ...filters,
      startDate: start.toISOString().split("T")[0],
      endDate: now.toISOString().split("T")[0]
    });
  };

  const [categories, setCategories] = useState([]);
  const [labels, setLabels] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, labelRes, userRes] = await Promise.all([
          CategoryService.getCategories(),
          LabelService.getLabels(),
          FamilyService.getMyFamily()
        ]);

        const catData = catRes?.data || [];
        const userData = userRes.data.members || [];
        const labelData = labelRes.data || [];

        setCategories(catData);
        setLabels(labelData);
        setUsers(userData);
      } catch (err) {
        console.error("Failed to load filter data", err);
      }
    };

    fetchMeta();
  }, []);

  const fetchTransactions = async (pageToFetch = 1) => {
    setLoading(true);
    const toastId = toast.loading("Fetching Transactions.....")
    try {
      const activeFilters = {};

      Object.keys(filters).forEach(k => {
        const value = filters[k];

        if (
          value !== "" &&
          value !== null &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          activeFilters[k] = value;
        }
      });

      const res = await TransactionService.getTransactions({ ...activeFilters, page: pageToFetch });
      setTransactions(res.data);
      setSummary(res.summary);
      setTotalPages(res.totalPages || 1);
      setPage(res.page || 1);
      toast.success("Transactions fetched successfully", {id: toastId});
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      toast.error(err.response.data.message, { id: toastId,});
    } finally {
      setLoading(false);
    }
  };

  const getActiveFilters = () => {
    const activeFilters = {};

    Object.keys(filters).forEach((k) => {
      const value = filters[k];

      if (
        value !== "" &&
        value !== null &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        activeFilters[k] = value;
      }
    });

    return activeFilters;
  };


  const handleDownloadExcel = async () => {
    const toastId = toast.loading("Please wait....We are preparing excel");
    try {
      const activeFilters = getActiveFilters();

      const blob =
        await TransactionService.downloadTransactionsExcel(
          activeFilters
        );

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "transactions.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
      toast.success("Excel downloaded successfully", {id:toastId});
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message || "Failed to download excel.", {id:toastId});
    }
  };

  const handleEmailExcel = async () => {
    const toastId = toast.loading("Please wait while we send email....");
    try {
      const activeFilters = getActiveFilters();

      const res =
        await TransactionService.emailTransactionsExcel(
          activeFilters
        );

      toast.success(res.message || "Email sent successfully...!", {id:toastId});
    } catch (err) {
      console.error(err);
      toaast.error( err.response.data.message  || "Failed to send email", {id:toastId});
    }
  };

  useEffect(() => {
    const handleTransactionChange = () => {
      fetchTransactions(page);
    };

    setupTransactionListeners(handleTransactionChange);

    return () => {
      removeTransactionListeners(handleTransactionChange);
    };
  }, [page, filters]);

  const handleSearchClick = () => {
    fetchTransactions(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "",
      minAmount: "",
      maxAmount: "",
      startDate: "",
      endDate: "",
      category: null,
      label: [],
      user: []
    });
  };

  const getTypeColor = (type) => {
    if (type === "income") return "text-income bg-income-bg px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider";
    if (type === "expense") return "text-expense bg-expense-bg px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider";
    return "text-investment bg-investment-bg px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider";
  };

  return (
    <div className="bg-bg min-h-[calc(100vh-64px)] p-0 sm:p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-6">

        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface p-6 rounded-2xl shadow-card border border-border">
          <div>
            <h2 className="text-2xl font-bold text-text">
              Transactions
            </h2>


            <p className="mt-3 text-sm text-text-secondary max-w-xl">
              Apply filters to narrow down results, then click
              <span className="font-medium text-text"> Show Transactions </span>
              to view matching records.
            </p>
          </div>
          <button
            onClick={() => navigate("/transactions/create")}
            className="inline-flex items-center gap-2 bg-primary text-text-on-primary px-5 py-2.5 rounded-xl hover:bg-primary-hover  font-medium transition-colors hover:cursor-pointer">
            <Plus size={18} />
            Add Transaction
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface p-6 rounded-2xl shadow-card border border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-md font-semibold text-muted mb-1">Search</label>
              <input
                placeholder="Title, description..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus transition-colors text-sm"
              />
            </div>
            
            <div className="lg:col-span-1">
              <TypeSelect
                value={filters.type}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    type: value,
                  }))
                }
              />
            </div>

            

            <div className="lg:col-span-1">
              <label className="block text-md font-semibold text-muted mb-1">Min Amount</label>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={filters.minAmount}
                onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus transition-colors text-sm"
              />
            </div>

            <div className="lg:col-span-1">
              <label className="block text-md font-semibold text-muted mb-1">Max Amount</label>
              <input
                type="number"
                min="0"
                placeholder="99999"
                value={filters.maxAmount}
                onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus transition-colors text-sm"
              />
            </div>

             <div className="lg:col-span-1">
              <label className="block text-md font-semibold text-muted mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus transition-colors text-sm"
              />
            </div>

            <div className="lg:col-span-1">
              <label className="block text-md font-semibold text-muted mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus transition-colors text-sm"
              />
            </div>

            <SingleSelectSheet
              label="Category"
              title="Select Category"
              options={categories}
              selectedId={filters.category}
              onChange={(id) =>
                setFilters(prev => ({
                  ...prev,
                  category: id
                }))
              }
              placeholder="Select category"
            />

            <MultiSelectSheet
              label="Label"
              title="Select Labels"
              options={labels}
              selectedIds={filters.label}
              onChange={(ids) => setFilters({ ...filters, label: ids })}
              placeholder="Select labels"
            />
            <MultiSelectSheet
              label="User"
              title="Select Users"
              options={users}
              selectedIds={filters.user}
              onChange={(ids) => setFilters({ ...filters, user: ids })}
              placeholder="Select users"
            />

            {/* Quick Filters */}
            <div className="lg:col-span-3">
              <label className="block text-md font-semibold text-muted mb-2">
                Quick Date Filters
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => applyQuickFilter("1m")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-2  border border-border text-text-secondary  hover:bg-surface-3 hover:text-text transition-colors hover:cursor-pointer">
                  <CalendarDays size={16} />
                  Past Month
                </button>

                <button
                  onClick={() => applyQuickFilter("3m")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-text-secondary  hover:bg-surface-3  hover:text-text  transition-colors hover:cursor-pointer">
                  <CalendarDays size={16} />
                  Past 3 Months
                </button>
              </div>
            </div>
          </div>
          
          {/* Action Bar */}
          <div className="mt-8 pt-6 border-t border-divider">

            <div className="flex flex-wrap gap-3 justify-between">

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={handleDownloadExcel}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 hover:border-primary/50 transition-colors hover:cursor-pointer font-medium"
                >
                  <Download size={16} />
                  Download Excel
                </button>

                <button
                  onClick={handleEmailExcel}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 hover:border-primary/50 transition-colors hover:cursor-pointer font-medium"
                >
                  <Mail size={16} />
                  Email Excel
                </button>

              </div>


              <div className="flex flex-wrap gap-3">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2  px-4  py-2.5  rounded-xl  bg-surface-2  border  border-border  text-text-secondary  hover:bg-surface-3  hover:text-text transition-colors hover:cursor-pointer" >
                  <RotateCcw size={16} />
                  Clear Filters
                </button>

                <button
                  onClick={handleSearchClick}
                  disabled={loading}
                  className="inline-flex items-center gap-2  px-4  py-2.5  rounded-xl bg-primary text-text-on-primary  hover:bg-primary-hover  disabled:opacity-50  transition-colors  font-medium">
                  <Search size={16} />
                  {loading ? "Loading........" : "Show Transactions"}
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Summary Section */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Income */}
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-card">
              <p className="text-sm text-muted mb-2">
                Total Income
              </p>

              <h3 className="text-2xl font-bold text-income">
                ₹{summary.incomeTotal.toLocaleString()}
              </h3>
            </div>

            {/* Expense */}
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-card">
              <p className="text-sm text-muted mb-2">
                Total Expense
              </p>

              <h3 className="text-2xl font-bold text-expense">
                ₹{summary.expenseTotal.toLocaleString()}
              </h3>
            </div>

            {/* Investment */}
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-card">
              <p className="text-sm text-muted mb-2">
                Total Investment
              </p>

              <h3 className="text-2xl font-bold text-investment">
                ₹{summary.investmentTotal.toLocaleString()}
              </h3>
            </div>

            {/* Net Balance */}
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-card">
              <p className="text-sm text-muted mb-2">
                Net Balance
              </p>

              <h3
                className={`text-2xl font-bold ${
                  summary.netBalance >= 0
                    ? "text-income"
                    : "text-expense"
                }`}
              >
                ₹{summary.netBalance.toLocaleString()}
              </h3>
            </div>

          </div>
        )}

        {/* Results Section */}
        <div className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">


          {loading && transactions === null && (
            <div className="p-12 text-center text-muted animate-pulse">
               Fetching transactions...
            </div>
          )}

          {transactions !== null &&
            Object.values(transactions).every(group => group.transactions.length === 0) &&
            !loading && (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-surface-2 border border-border flex items-center justify-center">
                  <Search size={36} className="text-muted" />
                </div>

                <h3 className="text-xl font-semibold text-text mb-2">
                  No Transactions Found
                </h3>

                <p className="text-text-secondary max-w-md mx-auto">
                  We couldn't find any transactions matching your current filters.
                </p>
              </div>
          )}

          {transactions !== null  && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg border-b border-divider">
                    <th className="p-4 text-sm font-medium text-muted">Title</th>
                    <th className="p-4 text-sm font-medium text-muted">Type</th>
                    <th className="p-4 text-sm font-medium text-muted">Categories</th>
                    <th className="p-4 text-sm font-medium text-muted">Labels</th>
                    <th className="p-4 text-sm font-medium text-muted">Date</th>
                    <th className="p-4 text-sm font-medium text-muted">Member</th>
                    <th className="p-4 text-sm font-medium text-muted text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider">
                  {["income", "expense", "investment"].map(type => {
                    const group = transactions[type];
                    if (!group || group.transactions.length === 0) return null;

                    return (
                      <React.Fragment key={type}>
                        {/* SECTION HEADER */}
                        <tr className="bg-bg">
                          <td colSpan="7" className="p-4 font-bold uppercase text-sm text-muted">
                            {type}
                          </td>
                        </tr>

                        {/* ROWS */}
                        {group.transactions.map(t => (
                          <tr
                            key={t._id}
                            onClick={() => navigate(`/transactions/${t._id}`)}
                            className="hover:bg-card-hover cursor-pointer transition-colors duration-150 group"
                          >
                            <td className="p-4">
                              <div className="font-medium text-text group-hover:text-primary">
                                {t.title}
                              </div>
                              {t.description && (
                                <div className="text-xs text-muted truncate max-w-xs">
                                  {t.description}
                                </div>
                              )}
                            </td>

                            <td className="p-4">
                              <span className={getTypeColor(t.type)}>{t.type}</span>
                            </td>

                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {t.category ? (
                                  <span className="text-xs px-2 py-0.5 bg-surface-2 border border-border rounded-md text-text">
                                    {t.category.name}
                                  </span>
                                ) : (
                                  <span className="text-muted text-xs">N/A</span>
                                )}
                              </div>
                            </td>

                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {t.labels?.map(l => (
                                  <span key={l._id || l} className="text-xs px-2 py-0.5 bg-surface-2 border border-border rounded-md text-text">
                                    {l.name || "N/A"}
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="p-4 text-sm text-text-secondary">
                              {t.date ? new Date(t.date).toLocaleDateString() : "N/A"}
                            </td>

                            <td className="p-4 text-sm text-text-secondary">
                              {t.user?.name || "N/A"}
                            </td>

                            <td className={`p-4 text-right font-semibold ${
                              t.type === 'expense'
                                ? 'text-expense'
                                : t.type === 'income'
                                ? 'text-income'
                                : 'text-investment'
                            }`}>
                              ₹{t.amount?.toLocaleString()}
                            </td>
                          </tr>
                        ))}

                        {/* TOTAL ROW */}
                        <tr className="bg-surface-2 border-t border-divider">
                          <td colSpan="6" className="p-4 text-right font-semibold text-text">
                            Subtotal {type}
                          </td>
                          <td className="p-4 text-right font-bold text-text">
                            ₹{group.total.toLocaleString()}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center p-4 border-t border-divider bg-bg">
                  <button
                    disabled={page <= 1 || loading}
                    onClick={() => fetchTransactions(page - 1)}
                    className="px-4 py-2 bg-surface border border-border text-text rounded-xl hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-muted font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages || loading}
                    onClick={() => fetchTransactions(page + 1)}
                    className="px-4 py-2 bg-surface border border-border text-text rounded-xl hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TransactionsList;