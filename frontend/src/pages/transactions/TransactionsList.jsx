import { useState } from "react";
import TransactionService from "../../services/transaction.service";
import { useNavigate } from "react-router-dom";

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
    endDate: ""
  });

  const fetchTransactions = async (pageToFetch = 1) => {
    setLoading(true);
    try {
      const activeFilters = {};
      Object.keys(filters).forEach(k => {
        if (filters[k]) activeFilters[k] = filters[k];
      });

      const res = await TransactionService.getTransactions({ ...activeFilters, page: pageToFetch });
      setTransactions(res.data);
      setTotalPages(res.totalPages || 1);
      setPage(res.page || 1);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

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
      endDate: ""
    });
  };

  const getTypeColor = (type) => {
    if (type === "income") return "text-income bg-green-50 px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider";
    if (type === "expense") return "text-expense bg-red-50 px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider";
    return "text-investment bg-purple-50 px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider";
  };

  return (
    <div className="bg-bg min-h-[calc(100vh-64px)] p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-6">

        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface p-6 rounded-2xl shadow-sm border border-border">
          <div>
            <h2 className="text-2xl font-bold text-text">Transactions</h2>
            <p className="text-muted text-sm mt-1">Manage and filter your transaction history.</p>
          </div>
          <button
            onClick={() => navigate("/transactions")}
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

          {transactions !== null && transactions.length === 0 && !loading && (
             <div className="p-12 text-center">
               <h3 className="text-lg font-semibold text-text mb-1">No transactions found</h3>
               <p className="text-sm text-muted">Try adjusting your filters.</p>
             </div>
          )}

          {transactions !== null && transactions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg border-b border-border">
                    <th className="p-4 text-sm font-medium text-muted">Title</th>
                    <th className="p-4 text-sm font-medium text-muted">Type</th>
                    <th className="p-4 text-sm font-medium text-muted">Categories</th>
                    <th className="p-4 text-sm font-medium text-muted">Date</th>
                    <th className="p-4 text-sm font-medium text-muted text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
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
                      <td className="p-4 text-sm text-muted">
                        {t.date ? new Date(t.date).toLocaleDateString() : "N/A"}
                      </td>
                      <td className={`p-4 text-right font-semibold ${t.type === 'expense' ? 'text-expense' : t.type === 'income' ? 'text-income' : 'text-investment'}`}>
                        ₹{t.amount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
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