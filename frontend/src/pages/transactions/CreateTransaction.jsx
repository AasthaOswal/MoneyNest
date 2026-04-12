// import { useEffect, useState } from "react";
// import TransactionService from "../../services/transaction.service";
// import api from "../../axios/axios";
// import { useNavigate } from "react-router-dom";
// import MultiSelectSheet from "../../components/transactions/MultiSelectSheet";

// const CreateTransaction = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     type: "expense",
//     title: "",
//     amount: "",
//     category: [],
//     labels: [],
//     description: "",
//     note: "",
//     date: new Date().toISOString().split("T")[0],
//   });

//   const [file, setFile] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [labels, setLabels] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const fetchTypeData = async (type) => {
//     try {
//       const [categoryRes, labelRes] = await Promise.all([
//         api.get(`/categories?type=${type}`),
//         api.get("/labels"),
//       ]);

//       setCategories(categoryRes.data.data || []);
//       setLabels(labelRes.data.data || []);
//     } catch (err) {
//       console.error("Failed to fetch categories/labels", err);
//     }
//   };

//   useEffect(() => {
//     fetchTypeData(form.type);
//   }, [form.type]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleTypeChange = (type) => {
//     setForm((prev) => ({
//       ...prev,
//       type,
//       category: [],
//       labels: [],
//     }));
//   };

//   const handleCategoryChange = (values) => {
//     setForm((prev) => ({ ...prev, category: values }));
//   };

//   const handleLabelChange = (values) => {
//     setForm((prev) => ({ ...prev, labels: values }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMsg("");

//     try {
//       if (form.category.length === 0) {
//         throw new Error("Please select at least one category.");
//       }

//       if (form.labels.length === 0) {
//         throw new Error("Please select at least one label.");
//       }

//       const response = await TransactionService.createTransaction({
//         ...form,
//         transactionDoc: file,
//       });

//       navigate(`/transactions/${response.data.data._id}`);
//     } catch (err) {
//       setErrorMsg(
//         err.response?.data?.message || err.message || "Something went wrong."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-64px)] bg-bg px-4 py-6 md:px-8 md:py-10">
//       <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-surface shadow-sm">
//         <div className="flex flex-col gap-4 border-b border-border px-6 py-6 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-text">Create Transaction</h2>
//             <p className="mt-1 text-sm text-muted">
//               Record a new income, expense, or investment.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => navigate("/transactions/all")}
//             className="rounded-xl border border-primary px-4 py-2 font-medium text-primary transition-colors hover:bg-primary hover:text-white"
//           >
//             View Transactions
//           </button>
//         </div>

//         {errorMsg && (
//           <div className="mx-6 mt-6 rounded-xl border border-expense bg-surface px-4 py-3 text-sm text-expense">
//             {errorMsg}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//             {["expense", "income", "investment"].map((type) => (
//               <label
//                 key={type}
//                 className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
//                   form.type === type
//                     ? type === "expense"
//                       ? "border-expense bg-surface text-expense"
//                       : type === "income"
//                       ? "border-income bg-surface text-income"
//                       : "border-investment bg-surface text-investment"
//                     : "border-border bg-bg text-muted hover:border-primary hover:text-text"
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="type"
//                   value={type}
//                   checked={form.type === type}
//                   onChange={() => handleTypeChange(type)}
//                   className="hidden"
//                 />
//                 <span className="capitalize">{type}</span>
//               </label>
//             ))}
//           </div>

//           <div className="space-y-5">
//             <div>
//               <label className="mb-2 block text-sm font-medium text-text">
//                 Title <span className="text-expense">*</span>
//               </label>
//               <input
//                 required
//                 name="title"
//                 value={form.title}
//                 placeholder="e.g. Monthly Groceries"
//                 onChange={handleChange}
//                 className="w-full rounded-xl border border-border bg-bg p-3 text-text shadow-sm outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
//               />
//             </div>

//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-text">
//                   Amount <span className="text-expense">*</span>
//                 </label>
//                 <div className="relative">
//                   <span className="pointer-events-none absolute left-4 top-3.5 text-muted">
//                     ₹
//                   </span>
//                   <input
//                     required
//                     name="amount"
//                     type="number"
//                     min="0"
//                     value={form.amount}
//                     placeholder="0.00"
//                     onChange={handleChange}
//                     className="w-full rounded-xl border border-border bg-bg py-3 pl-8 pr-3 text-text shadow-sm outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-text">
//                   Date
//                 </label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={form.date}
//                   onChange={handleChange}
//                   className="w-full rounded-xl border border-border bg-bg p-3 text-text shadow-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-medium text-text">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={form.description}
//                 placeholder="Add some descriptive text..."
//                 rows="3"
//                 onChange={handleChange}
//                 className="w-full resize-none rounded-xl border border-border bg-bg p-3 text-text shadow-sm outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
//               />
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-medium text-text">
//                 Note
//               </label>
//               <textarea
//                 name="note"
//                 value={form.note}
//                 placeholder="Any personal notes?"
//                 rows="3"
//                 onChange={handleChange}
//                 className="w-full resize-none rounded-xl border border-border bg-bg p-3 text-text shadow-sm outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
//               />
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-medium text-text">
//                 Attachment
//               </label>
//               <input
//                 type="file"
//                 onChange={(e) => setFile(e.target.files?.[0] || null)}
//                 className="w-full cursor-pointer rounded-xl border border-border bg-bg p-2 text-text shadow-sm file:mr-4 file:rounded-lg file:border-0 file:bg-surface file:px-4 file:py-2 file:text-sm file:font-medium file:text-text hover:file:bg-border"
//               />
//             </div>
//           </div>

//           <div className="space-y-5 border-t border-border pt-6">
//             <MultiSelectSheet
//               label="Categories"
//               title="Select Categories"
//               options={categories}
//               selectedIds={form.category}
//               onChange={handleCategoryChange}
//               placeholder={`Select categories for ${form.type}`}
//               emptyText={`No categories found for ${form.type}.`}
//               accent={form.type}
//             />

            

//             <MultiSelectSheet
//               label="Labels"
//               title="Select Labels"
//               options={labels}
//               selectedIds={form.labels}
//               onChange={handleLabelChange}
//               placeholder="Select labels"
//               emptyText="No labels found."
//               accent="primary"
//             />
//           </div>

//           <div className="pt-2">
//             <button
//               type="submit"
//               disabled={loading}
//               className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-medium text-white shadow-md transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
//             >
//               {loading ? "Saving..." : "Save Transaction"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateTransaction;


import { useEffect, useState } from "react";
import TransactionService from "../../services/transaction.service";
import api from "../../axios/axios";
import { useNavigate } from "react-router-dom";
import MultiSelectSheet from "../../components/transactions/MultiSelectSheet";

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
    fetchTypeData(form.type);
  }, [form.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      type,
      category: [],
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
      if (form.category.length === 0) {
        throw new Error("Please select at least one category.");
      }

      if (form.labels.length === 0) {
        throw new Error("Please select at least one label.");
      }

      const response = await TransactionService.createTransaction({
        ...form,
        transactionDoc: file,
      });

      navigate(`/transactions/${response.data._id}`);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text">Create Transaction</h2>
            <p className="mt-1 text-sm text-muted">
              Record a new income, expense, or investment.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/transactions")}
            className="rounded-xl border border-primary px-4 py-2 font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            View Transactions
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-6 rounded-xl border border-expense bg-surface px-4 py-3 text-sm text-expense">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
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
                  name="type"
                  value={type}
                  checked={form.type === type}
                  onChange={() => handleTypeChange(type)}
                  className="hidden"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Title <span className="text-expense">*</span>
              </label>
              <input
                required
                name="title"
                value={form.title}
                placeholder="e.g. Monthly Groceries"
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-bg p-3 text-text shadow-sm outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-text">
                  Amount <span className="text-expense">*</span>
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
                    className="w-full rounded-xl border border-border bg-bg py-3 pl-8 pr-3 text-text shadow-sm outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
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
                  className="w-full rounded-xl border border-border bg-bg p-3 text-text shadow-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

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
                className="w-full resize-none rounded-xl border border-border bg-bg p-3 text-text shadow-sm outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

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
                className="w-full resize-none rounded-xl border border-border bg-bg p-3 text-text shadow-sm outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

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

          <div className="space-y-5 border-t border-border pt-6">
            <MultiSelectSheet
              label="Categories"
              title="Select Categories"
              options={categories}
              selectedIds={form.category}
              onChange={handleCategoryChange}
              placeholder={`Select categories for ${form.type}`}
              emptyText={`No categories found for ${form.type}.`}
            />

            <MultiSelectSheet
              label="Labels"
              title="Select Labels"
              options={labels}
              selectedIds={form.labels}
              onChange={handleLabelChange}
              placeholder="Select labels"
              emptyText="No labels found."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-medium text-white shadow-md transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
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