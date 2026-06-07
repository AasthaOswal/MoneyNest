import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from "recharts";

const ContributionChart = ({contributionChartData, COLORS}) => {

    const [isMobile, setIsMobile] = useState(false);


    useEffect(() => {
        setIsMobile(window.innerWidth < 425);

    }, []);

    


    return (

        <>
        {isMobile ? (
                <div className="space-y-6">

                    <div>
                    <h3 className="text-income font-semibold mb-3">
                        Income Distribution
                    </h3>

                    <MobileContributionCards
                        data={contributionChartData.income}
                        type="income"
                    />
                    </div>

                    <div>
                    <h3 className="text-expense font-semibold mb-3">
                        Expense Distribution
                    </h3>

                    <MobileContributionCards
                        data={contributionChartData.expense}
                        type="expense"
                    />
                    </div>

                    <div>
                    <h3 className="text-investment font-semibold mb-3">
                        Investment Distribution
                    </h3>

                    <MobileContributionCards
                        data={contributionChartData.investment}
                        type="investment"
                    />
                    </div>

                </div>
            ) 
            : 
            ( <Section title="Contribution Charts">

                <div className="  grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

                    {/* Income */}
                    <div className="  bg-card border border-border rounded-2xl p-5 min-h-105">
                        <h3 className="font-semibold mb-2 text-income">
                            Income Distribution
                        </h3>

                        <PieChart width={300} height={300} style={{ background: "transparent" }}>
                            <Pie
                            data={contributionChartData.income}
                            dataKey="amount"
                            nameKey="name"
                            outerRadius={90}
                            label
                            stroke="none"
                            >
                            {contributionChartData.income.map((_, index) => (
                                <Cell
                                key={index}
                                fill={COLORS.income[index % COLORS.income.length]}
                                />
                            ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>

                    {/* Expense */}
                    <div className="bg-card border border-border rounded-2xl p-5 min-h-105">
                        <h3 className="font-semibold mb-2 text-expense">
                            Expense Distribution
                        </h3>

                        <PieChart width={300} height={300} style={{ background: "transparent" }}>
                            <Pie
                            data={contributionChartData.expense}
                            dataKey="amount"
                            nameKey="name"
                            outerRadius={90}
                            label
                            stroke="none"
                            >
                            {contributionChartData.expense.map((_, index) => (
                                <Cell
                                key={index}
                                fill={COLORS.expense[index % COLORS.expense.length]}
                                />
                            ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>

                    {/* Investment */}
                    <div className=" bg-card border border-border rounded-2xl p-5 min-h-105">
                        <h3 className="font-semibold mb-2 text-investment">
                            Investment Distribution
                        </h3>

                        <PieChart width={300} height={300} style={{ background: "transparent" }}>
                            <Pie
                            data={contributionChartData.investment}
                            dataKey="amount"
                            nameKey="name"
                            outerRadius={90}
                            label
                            stroke="none"
                            >
                            {contributionChartData.investment.map((_, index) => (
                                <Cell
                                key={index}
                                fill={COLORS.investment[index % COLORS.investment.length]}
                                />
                            ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>

                </div>

            </Section>
            )}
        </>

    );
};

export default ContributionChart;





/* ================= COMPONENTS ================= */


const Section = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
        {children}
      </div>
    </div>
  );
};



const MobileContributionCards = ({ data, type }) => {
  return (
    <div className="space-y-3">
      {data.map((user, index) => (
        <div
          key={user.name}
          className="
            bg-card
            border
            border-border
            rounded-xl
            p-4
          "
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-text">
                {user.name}
              </h4>

              <p className="text-sm text-text-secondary">
                ₹{user.amount.toLocaleString()}
              </p>
            </div>

            <div
              className="
                px-3
                py-1
                rounded-lg
                text-sm
                font-semibold
              "
              style={{
                background:
                  type === "income"
                    ? "var(--color-income-bg)"
                    : type === "expense"
                    ? "var(--color-expense-bg)"
                    : "var(--color-investment-bg)",

                color:
                  type === "income"
                    ? "var(--color-income)"
                    : type === "expense"
                    ? "var(--color-expense)"
                    : "var(--color-investment)"
              }}
            >
              {user.percent}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};