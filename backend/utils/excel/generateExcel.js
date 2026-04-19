import ExcelJS from "exceljs";

export const generateTransactionsExcel = async (transactions) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Transactions");

  // Columns
  worksheet.columns = [
    { header: "Title", key: "title", width: 20 },
    { header: "Type", key: "type", width: 15 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Category", key: "category", width: 20 },
    { header: "Date", key: "date", width: 20 },
    { header: "User", key: "user", width: 20 },
  ];

  // Rows
  transactions.forEach((t) => {
    worksheet.addRow({
      title: t.title,
      type: t.type,
      amount: t.amount,
      category: t.category?.map(c => c.name).join(", "),
      date: new Date(t.date).toLocaleDateString(),
      user: t.user?.name,
    });
  });

  return workbook;
};