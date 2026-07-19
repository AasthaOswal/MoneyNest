import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AIService from "../../services/ai.service";



const Benchmark = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBenchmark = async () => {
      // Initialize loading toast
       const toastId = toast.loading("Generating AI insights...");

      try {
        const response = await AIService.getAIFeature("benchmark");
        setData(response.data);
        
        // Success toast update
        toast.success("Insights loaded successfully!", { id: toastId });
      } catch (err) {
        const errMsg = err.message || "Something went wrong";
        setError(errMsg);
        
        // Error toast update
        toast.error(errMsg, { id: toastId });
      } finally {
        setLoading(false);
      }
    };

    fetchBenchmark();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center bg-[var(--color-bg)] text-[var(--color-text-secondary)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-divider)] border-t-[var(--color-primary)]"></div>
          <p>Analyzing financial benchmarks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 rounded-lg border border-[var(--color-error)] bg-[var(--color-error-bg)] p-4 text-[var(--color-error)]">
        <p className="font-medium">Error Loading Data</p>
        <p className="text-sm opacity-90">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6 text-[var(--color-text)] antialiased">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Benchmark Comparison
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            AI-driven breakdown and benchmark indicators
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-xs font-medium text-[var(--color-muted)]">
          Rating:{" "}
          <span className="font-semibold text-[var(--color-warning)]">
            {data?.overallRating}
          </span>
        </div>
      </div>

      {/* Summary Box */}
      {data?.summary && (
        <div className="mb-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Executive Summary
          </h2>
          <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
            {data.summary}
          </p>
        </div>
      )}

      {/* Highlights: Best vs Improve */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-3 text-sm font-semibold text-[var(--color-success)] uppercase tracking-wider">
            Top Performing Areas
          </h3>
          <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            {data?.bestPerformingAreas?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-success)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-3 text-sm font-semibold text-[var(--color-error)] uppercase tracking-wider">
            Areas to Improve
          </h3>
          <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            {data?.areasToImprove?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-error)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed Metrics Table Container */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-divider)]">
          <h3 className="font-semibold text-[var(--color-text)]">Metric Benchmarks</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-divider)] bg-[var(--color-surface-2)] text-[var(--color-muted)] font-medium">
                <th className="p-4">Metric</th>
                <th className="p-4">Your Value</th>
                <th className="p-4">Target Benchmark</th>
                <th className="p-4">Status</th>
                <th className="p-4">Context & Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-divider)]">
              {data?.comparisons?.map((item, idx) => {
                let statusBadgeColor = "text-[var(--color-muted)] bg-[var(--color-surface-3)]";
                if (item.status === "Above" || item.status === "Within") {
                  statusBadgeColor = "text-[var(--color-success)] bg-[var(--color-success-bg)]";
                } else if (item.status === "Below") {
                  statusBadgeColor = "text-[var(--color-error)] bg-[var(--color-error-bg)]";
                }

                // Financial context tag helper text styling matching variables
                let metricTag = "text-[var(--color-primary)]";
                if (item.metric.includes("Income")) metricTag = "text-[var(--color-income)]";
                if (item.metric.includes("Expense")) metricTag = "text-[var(--color-expense)]";
                if (item.metric.includes("Investment")) metricTag = "text-[var(--color-investment)]";

                return (
                  <tr key={idx} className="hover:bg-[var(--color-card-hover)] transition-colors">
                    <td className={`p-4 font-semibold ${metricTag}`}>
                      {item.metric}
                    </td>
                    <td className="p-4 text-[var(--color-text)]">
                      {typeof item.familyValue === "number" 
                        ? `${item.familyValue}%` 
                        : String(item.familyValue)}
                    </td>
                    <td className="p-4 text-[var(--color-text-secondary)]">
                      {item.benchmark}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold ${statusBadgeColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 max-w-sm space-y-1 text-xs">
                      <p className="text-[var(--color-text-secondary)]">{item.explanation}</p>
                      <p className="text-[var(--color-muted)]">
                        <span className="font-medium text-[var(--color-text-secondary)]">Impact:</span> {item.financialImpact}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Benchmark;