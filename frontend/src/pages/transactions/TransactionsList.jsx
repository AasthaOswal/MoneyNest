import React, { useState, useEffect } from "react";
import TransactionService from "../../services/transaction.service";
import LabelService from "../../services/label.service";
import CategoryService from "../../services/category.service";
import FamilyService from "../../services/family.service";
import { useNavigate } from "react-router-dom";
import MultiSelectSheet from "../../components/transactions/MultiSelectSheet";
import SingleSelectSheet from "../../components/transactions/SingleSelectSheet";

import {
  setupTransactionListeners,
  removeTransactionListeners,
} from "../../socket/socketTransaction";

const TransactionsList = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState(null); // null means hasn't searched yet
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

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

        console.log(catRes)
        console.log(labelRes)
        console.log(userRes)

        const catData = catRes?.data || [];
        const userData = userRes.data.members || [];
        const labelData = labelRes.data || [];
        console.log("API categories:", catData);
        console.log("API users:", userData);
        console.log("API labels:", labelData);

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

      console.log(activeFilters)

      const res = await TransactionService.getTransactions({ ...activeFilters, page: pageToFetch });
      console.log(res);
      setTransactions(res.data);
      setTotalPages(res.totalPages || 1);
      setPage(res.page || 1);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const handleTransactionChange = () => {
    console.log("Transactions realtime refresh");

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
    if (type === "income") return "text-income bg-green-50 px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider";
    if (type === "expense") return "text-expense bg-red-50 px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider";
    return "text-investment bg-purple-50 px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider";
  };




  return (
    <div className="bg-bg min-h-[calc(100vh-64px)] p-0 sm:p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-6">

        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface p-6 rounded-2xl shadow-sm border border-border">
          <div>
            <h2 className="text-2xl font-bold text-text">Transactions</h2>
            <p className="text-muted text-sm mt-1">Manage and filter your transaction history.</p>
          </div>
          <button
            onClick={() => navigate("/transactions/create")}
            className="bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-hover font-medium shadow-sm transition-colors duration-200"
          >
            + Add Transaction
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-muted mb-1">Search</label>
              <input
                placeholder="Title, description...  "
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full p-2.5 border border-border rounded-xl bg-bg text-text focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
            
            <div className="lg:col-span-1">
              <label className="block text-xs font-medium text-muted mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full p-2.5 border border-border rounded-xl bg-bg text-text focus:outline-none focus:border-primary transition-colors text-sm"
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="investment">Investment</option>
              </select>
            </div>

            <div className="lg:col-span-1">
              <label className="block text-xs font-medium text-muted mb-1">Min Amount</label>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={filters.minAmount}
                onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                className="w-full p-2.5 border border-border rounded-xl bg-bg text-text focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>

            <div className="lg:col-span-1">
              <label className="block text-xs font-medium text-muted mb-1">Max Amount</label>
              <input
                type="number"
                min="0"
                placeholder="99999"
                value={filters.maxAmount}
                onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                className="w-full p-2.5 border border-border rounded-xl bg-bg text-text focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>

             <div className="lg:col-span-1">
              <label className="block text-xs font-medium text-muted mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full p-2.5 border border-border rounded-xl bg-bg text-text focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>

            <div className="lg:col-span-1">
              <label className="block text-xs font-medium text-muted mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full p-2.5 border border-border rounded-xl bg-bg text-text focus:outline-none focus:border-primary transition-colors text-sm"
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

            {/* Past Month and Past 3 moonths filter */}
            <div className="flex gap-2">
              <button
                onClick={() => applyQuickFilter("1m")}
                className="px-3 py-1 bg-bg border rounded-lg text-sm"
              >
                Past Month
              </button>

              <button
                onClick={() => applyQuickFilter("3m")}
                className="px-3 py-1 bg-bg border rounded-lg text-sm"
              >
                Past 3 Months
              </button>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-border text-muted rounded-xl hover:bg-bg transition-colors duration-200 text-sm font-medium"
            >
              Clear
            </button>
            <button
              onClick={handleSearchClick}
              disabled={loading}
              className="px-6 py-2 bg-text text-surface rounded-xl hover:opacity-90 transition-colors duration-200 text-sm font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? "Searching..." : "Show Transactions"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
          {transactions === null && !loading && (
             <div className="p-12 text-center">
               <div className="w-16 h-16 bg-bg text-muted rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                 🔍
               </div>
               <h3 className="text-lg font-semibold text-text mb-1">Search Transactions</h3>
               <p className="text-sm text-muted">Adjust the filters above and click Show Transactions. </p>
               <p className="text-sm text-primary">For full details click on the trasnaction yoou want to see full details for</p>
             </div>
          )}

          {loading && transactions === null && (
            <div className="p-12 text-center text-muted animate-pulse">
               Fetching transactions...
            </div>
          )}

          {transactions !== null &&
  Object.values(transactions).every(group => group.transactions.length === 0) &&
  !loading && (
    <div className="p-12 text-center">
      <h3 className="text-lg font-semibold text-text mb-1">No transactions found</h3>
      <p className="text-sm text-muted">Try adjusting your filters.</p>
    </div>
)}

          {transactions !== null  && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg border-b border-border">
                    <th className="p-4 text-sm font-medium text-muted">Title</th>
                    <th className="p-4 text-sm font-medium text-muted">Type</th>
                    <th className="p-4 text-sm font-medium text-muted">Categories</th>
                    <th className="p-4 text-sm font-medium text-muted">Labels</th>
                    <th className="p-4 text-sm font-medium text-muted">Date</th>
                    <th className="p-4 text-sm font-medium text-muted">Member</th>
                    <th className="p-4 text-sm font-medium text-muted text-right">Amount</th>
                  </tr>
                </thead>
                {/* <tbody className="divide-y divide-border">
                  {transactions.map(t => (
                    <tr 
                      key={t._id} 
                      onClick={() => navigate(`/transactions/${t._id}`)}
                      className="hover:bg-bg cursor-pointer transition-colors duration-150 group"
                    >
                      <td className="p-4">
                        <div className="font-medium text-text group-hover:text-primary transition-colors">{t.title}</div>
                        {t.description && <div className="text-xs text-muted truncate max-w-xs">{t.description}</div>}
                      </td>
                      <td className="p-4">
                         <span className={getTypeColor(t.type)}>{t.type}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {t.category?.map(c => (
                            <span key={c._id || c} className="text-xs px-2 py-0.5 bg-bg border border-border rounded-md text-text">
                              {c.name || "N/A"}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {t.labels?.map(l => (
                            <span key={l._id || l} className="text-xs px-2 py-0.5 bg-bg border border-border rounded-md text-text">
                              {l.name || "N/A"}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted">
                        {t.date ? new Date(t.date).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="p-4 text-sm text-muted">
                        {t.user?.name || "N/A"}
                      </td>
                      <td className={`p-4 text-right font-semibold ${t.type === 'expense' ? 'text-expense' : t.type === 'income' ? 'text-income' : 'text-investment'}`}>
                        ₹{t.amount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody> */}
                <tbody className="divide-y divide-border">
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
            className="hover:bg-bg cursor-pointer transition-colors duration-150 group"
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
                  <span className="text-xs px-2 py-0.5 bg-bg border border-border rounded-md">
                    {t.category.name}
                  </span>
                ) : (
                  "N/A"
                )}
              </div>
            </td>

            <td className="p-4">
              <div className="flex flex-wrap gap-1">
                {t.labels?.map(l => (
                  <span key={l._id || l} className="text-xs px-2 py-0.5 bg-bg border border-border rounded-md">
                    {l.name || "N/A"}
                  </span>
                ))}
              </div>
            </td>

            <td className="p-4 text-sm text-muted">
              {t.date ? new Date(t.date).toLocaleDateString() : "N/A"}
            </td>

            <td className="p-4 text-sm text-muted">
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
        <tr className="bg-bg border-t">
          <td colSpan="6" className="p-4 text-right font-semibold text-text">
            Total {type}
          </td>
          <td className="p-4 text-right font-bold">
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
                <div className="flex justify-between items-center p-4 border-t border-border bg-bg">
                  <button
                    disabled={page <= 1 || loading}
                    onClick={() => fetchTransactions(page - 1)}
                    className="px-4 py-2 bg-surface border border-border text-text rounded-xl hover:bg-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-muted font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages || loading}
                    onClick={() => fetchTransactions(page + 1)}
                    className="px-4 py-2 bg-surface border border-border text-text rounded-xl hover:bg-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
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