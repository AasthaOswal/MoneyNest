// import puppeteer from "puppeteer";

// export const generateReportPDF = async (data) => {

//   const html = `
//     <html>
//       <body style="font-family: Arial; padding: 20px;">
        
//         <h1 style="text-align:center;">Monthly Report</h1>

//         <h2>Summary</h2>
//         <p>Income: ₹${data.summary.income}</p>
//         <p>Expense: ₹${data.summary.expense}</p>
//         <p>Investment: ₹${data.summary.investment}</p>
//         <p><b>Balance: ₹${data.summary.balance}</b></p>

//         <h2>Total Transactions</h2>
//         <p>${data.totalTransactions}</p>

//         <h2>Top Categories</h2>
//         <ul>
//           ${
//             data.categoryStats.expense
//               ?.map(c => `<li>${c.name}: ₹${c.total}</li>`)
//               .join("") || ""
//           }
//         </ul>

//       </body>
//     </html>
//   `;

//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   await page.setContent(html);

//   const pdfBuffer = await page.pdf({
//     format: "A4"
//   });

//   await browser.close();

//   return pdfBuffer;
// };


import puppeteer from "puppeteer";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const generateReportPDF = async (data) => {
  const topExpenseCategories = (data.categoryStats?.expense || [])
    .slice()
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const topLabels = (data.labelStats || [])
    .slice()
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const contributors = data.contributions || [];

  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 24px;
            color: #111827;
          }
          h1, h2, h3 {
            margin: 0 0 12px 0;
          }
          .muted {
            color: #6b7280;
            font-size: 12px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin: 18px 0 26px;
          }
          .card {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 14px;
          }
          .card .label {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 6px;
          }
          .card .value {
            font-size: 20px;
            font-weight: 700;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #e5e7eb;
            padding: 10px;
            text-align: left;
            font-size: 13px;
          }
          th {
            background: #f9fafb;
          }
          .section {
            margin-bottom: 26px;
          }
          .two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }
          ul {
            margin: 8px 0 0 18px;
          }
          .pill {
            display: inline-block;
            padding: 3px 8px;
            border: 1px solid #e5e7eb;
            border-radius: 999px;
            font-size: 12px;
            margin-right: 6px;
            margin-bottom: 6px;
          }
        </style>
      </head>
      <body>
        <h1>Monthly Finance Report</h1>
        <p class="muted">Generated automatically from your family transaction analytics</p>

        <div class="grid">
          <div class="card">
            <div class="label">Income</div>
            <div class="value">${money(data.summary?.income)}</div>
          </div>
          <div class="card">
            <div class="label">Expense</div>
            <div class="value">${money(data.summary?.expense)}</div>
          </div>
          <div class="card">
            <div class="label">Investment</div>
            <div class="value">${money(data.summary?.investment)}</div>
          </div>
          <div class="card">
            <div class="label">Balance</div>
            <div class="value">${money(data.summary?.balance)}</div>
          </div>
        </div>

        <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
          <div class="card">
            <div class="label">Total Gains</div>
            <div class="value">${money(data.summary?.totalGains)}</div>
          </div>
          <div class="card">
            <div class="label">Total Transactions</div>
            <div class="value">${Number(data.totalTransactions || 0).toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div class="section">
          <h2>Expense Categories</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${
                topExpenseCategories.length
                  ? topExpenseCategories
                      .map(
                        (c) => `
                          <tr>
                            <td>${escapeHtml(c.name || "Unnamed")}</td>
                            <td>${money(c.total)}</td>
                          </tr>
                        `
                      )
                      .join("")
                  : `<tr><td colspan="2">No expense category data available</td></tr>`
              }
            </tbody>
          </table>
        </div>

        <div class="two-col section">
          <div>
            <h2>Top Labels</h2>
            <table>
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${
                  topLabels.length
                    ? topLabels
                        .map(
                          (l) => `
                            <tr>
                              <td>${escapeHtml(l.name || "Unnamed")}</td>
                              <td>${money(l.total)}</td>
                            </tr>
                          `
                        )
                        .join("")
                    : `<tr><td colspan="2">No label data available</td></tr>`
                }
              </tbody>
            </table>
          </div>

          <div>
            <h2>Member Contributions</h2>
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Income</th>
                  <th>Expense</th>
                  <th>Investment</th>
                </tr>
              </thead>
              <tbody>
                ${
                  contributors.length
                    ? contributors
                        .map(
                          (u) => `
                            <tr>
                              <td>${escapeHtml(u.name || "Unknown")}</td>
                              <td>${money(u.income)} <span class="muted">(${u.incomePercent || 0}%)</span></td>
                              <td>${money(u.expense)} <span class="muted">(${u.expensePercent || 0}%)</span></td>
                              <td>${money(u.investment)} <span class="muted">(${u.investmentPercent || 0}%)</span></td>
                            </tr>
                          `
                        )
                        .join("")
                    : `<tr><td colspan="4">No contribution data available</td></tr>`
                }
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.emulateMediaType("screen");

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "12mm",
      right: "12mm",
    },
  });

  await browser.close();
  return pdfBuffer;
};