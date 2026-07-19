import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AIService from "../../services/ai.service";

const FinancialHealth = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialHealth = async () => {
      const toastId = toast.loading("Analyzing financial data...");

      try {
        const response = await AIService.getAIFeature("financialHealth");
        if (response.success && response.data) {
          setData(response.data);
          toast.success("Insights generated successfully!", { id: toastId });
        } else {
          throw new Error("Failed to parse financial metrics.");
        }
      } catch (err) {
        const errMsg = err.message || "Something went wrong";
        toast.error(errMsg, { id: toastId });
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialHealth();
  }, []);

  // Helper utility to style dynamic categories
  const getScoreColorClass = (score) => {
    if (score >= 80) return "text-[color:var(--color-success)]";
    if (score >= 65) return "text-[color:var(--color-warning)]";
    return "text-[color:var(--color-error)]";
  };

  const getScoreBgClass = (score) => {
    if (score >= 80) return "bg-[color:var(--color-success-bg)] border-[color:var(--color-success)]/20";
    if (score >= 65) return "bg-[color:var(--color-warning-bg)] border-[color:var(--color-warning)]/20";
    return "bg-[color:var(--color-error-bg)] border-[color:var(--color-error)]/20";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--color-bg)] text-[color:var(--color-text)]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--color-primary)] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[color:var(--color-text-secondary)] font-medium">Generating AI insights...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--color-bg)] text-[color:var(--color-text)]">
        <p className="text-[color:var(--color-error)] bg-[color:var(--color-error-bg)] px-4 py-3 rounded-xl border border-[color:var(--color-error)]/30">
          Could not load financial insights. Please refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-text)] p-6 md:p-10 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Summary Section */}
        <header className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl p-6 shadow-[dashed_var(--shadow-card)] flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[color:var(--color-text)] to-[color:var(--color-text-secondary)] bg-clip-text text-transparent">
              Financial Health Check
            </h1>
            <p className="text-[color:var(--color-text-secondary)] leading-relaxed text-sm md:text-base">
              {data.summary}
            </p>
          </div>
          
          {/* Main Ring Badge */}
          <div className={`flex items-center gap-4 px-5 py-4 rounded-xl border ${getScoreBgClass(data.overallScore)} shrink-0 w-full md:w-auto`}>
            <div className="relative flex items-center justify-center h-16 w-16 rounded-full border-4 border-current/20 font-bold text-2xl tracking-tighter">
              <span className={getScoreColorClass(data.overallScore)}>{data.overallScore}</span>
            </div>
            <div>
              <div className="text-xs text-[color:var(--color-text-secondary)] uppercase font-semibold tracking-wider">Overall Status</div>
              <div className={`text-xl font-bold ${getScoreColorClass(data.overallScore)}`}>{data.grade}</div>
            </div>
          </div>
        </header>

        {/* Quick Highlights: Strengths & Weaknesses */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[color:var(--color-success)] mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-current"></span> Key Strengths
            </h2>
            <ul className="space-y-3">
              {data.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-[color:var(--color-text-secondary)]">
                  <span className="text-[color:var(--color-success)] mt-0.5 font-medium">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[color:var(--color-error)] mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-current"></span> Focus Areas
            </h2>
            <ul className="space-y-3">
              {data.weaknesses.map((weakness, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-[color:var(--color-text-secondary)]">
                  <span className="text-[color:var(--color-error)] mt-0.5 font-bold">!</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Detailed Financial Metrics Breakdown */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-[color:var(--color-text)]">
            Metric Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.metrics.map((metric, idx) => {
              const scoreColor = getScoreColorClass(metric.score);
              return (
                <div 
                  key={idx} 
                  className="bg-[color:var(--color-card)] hover:bg-[color:var(--color-card-hover)] border border-[color:var(--color-border)] hover:border-[color:var(--color-border-hover)] rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between shadow-[var(--shadow-card)] group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-[color:var(--color-text)] group-hover:text-[color:var(--color-primary)] transition-colors">
                        {metric.name}
                      </h3>
                      <span className={`text-lg font-bold ${scoreColor}`}>
                        {metric.score}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-[color:var(--color-muted)] leading-relaxed">
                      {metric.reason}
                    </p>
                  </div>

                  {/* Visual Progress Bar indicator */}
                  <div className="mt-5 w-full bg-[color:var(--color-surface-3)] rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ease-out
                        ${metric.score >= 80 ? "bg-[color:var(--color-success)]" : 
                          metric.score >= 65 ? "bg-[color:var(--color-warning)]" : 
                          "bg-[color:var(--color-error)]"}`}
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FinancialHealth;