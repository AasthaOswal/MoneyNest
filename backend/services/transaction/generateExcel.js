import ExcelJS from "exceljs";

export const generateTransactionsExcel = async (transactions) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Transactions");

  // Columns
  worksheet.columns = [
    { header: "Title", key: "title", width: 20 },
    { header: "Description", key: "desc", width: 30},
    { header: "Type", key: "type", width: 15 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Category", key: "category", width: 20 },
    { header: "Labels", key: "labels", width: 30 },
    { header: "Date", key: "date", width: 20 },
    { header: "User", key: "user", width: 20 },
    { header: "Note", key: "note", width: 30},
    { header: "Transaction Doc", key : "transactionDoc", width: 50}
  ];

  // Rows
  transactions.forEach((t) => {
    worksheet.addRow({
      title: t.title,
      type: t.type,
      desc: t.description,
      amount: t.amount,
      category: t.category.name,
      labels: t.labels?.map(eachLabel => eachLabel.name).join(", "),
      date: new Date(t.date).toLocaleDateString(),
      user: t.user?.name,
      note: t.note,
      transactionDoc: t.transactionDoc?.url
    });
  });

  return workbook;
};