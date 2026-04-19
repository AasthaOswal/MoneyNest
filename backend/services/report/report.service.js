import puppeteer from "puppeteer";

export const generateReportPDF = async (data) => {

  const html = `
    <html>
      <body style="font-family: Arial; padding: 20px;">
        
        <h1 style="text-align:center;">Monthly Report</h1>

        <h2>Summary</h2>
        <p>Income: ₹${data.summary.income}</p>
        <p>Expense: ₹${data.summary.expense}</p>
        <p>Investment: ₹${data.summary.investment}</p>
        <p><b>Balance: ₹${data.summary.balance}</b></p>

        <h2>Total Transactions</h2>
        <p>${data.totalTransactions}</p>

        <h2>Top Categories</h2>
        <ul>
          ${
            data.categoryStats.expense
              ?.map(c => `<li>${c.name}: ₹${c.total}</li>`)
              .join("") || ""
          }
        </ul>

      </body>
    </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);

  const pdfBuffer = await page.pdf({
    format: "A4"
  });

  await browser.close();

  return pdfBuffer;
};