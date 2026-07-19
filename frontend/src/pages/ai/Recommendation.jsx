import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AIService from "../../services/ai.service";

const Recommendation = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [remainingRequests, setRemainingRequests] = useState(null);

  useEffect(() => {
    
    const fetchRecommendation = async () => {
      // Trigger native react-hot-toast loading spinner
      const toastId = toast.loading("Analyzing financial data...");
      
      try {
        const response = await AIService.getAIFeature("recommendation");
        if (response?.data) {
          setData(response.data);
          setRemainingRequests(response.remainingRequests);
          toast.success("Financial insights updated", { id: toastId });
        } else {
          throw new Error("Invalid response payload structure");
        }
      } catch (err) {
        const fallbackMsg = err.response?.data?.message || "Failed to load recommendations";
        setError(fallbackMsg);
        toast.error(fallbackMsg, { id: toastId });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, []);

  // Inline loader component matching your background theme
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[var(--color-primary-subtle)] border-t-[var(--color-primary)]"></div>
        <p className="mt-4 text-[var(--color-text-secondary)] font-medium">Generating AI insights...</p>
      </div>
    );
  }

  // Error block matching the error token variants
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4">
        <div className="w-full max-w-md border border-[var(--color-border)] bg-[var(--color-error-bg)] p-6 rounded-xl text-center">
          <p className="font-semibold text-[var(--color-error)]">Analysis Encountered Errors</p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{error}</p>
        </div>
      </div>
    );
  }

  // Dynamic conditional coloring mappings for category tokens
  const getCategoryStyles = (category) => {
    const cat = category?.toLowerCase();
    if (cat === "income") return "bg-[var(--color-income-bg)] text-[var(--color-income)]";
    if (cat === "expense") return "bg-[var(--color-expense-bg)] text-[var(--color-expense)]";
    if (cat === "investment") return "bg-[var(--color-investment-bg)] text-[var(--color-investment)]";
    return "bg-[var(--color-surface-3)] text-[var(--color-text)]";
  };

  // Dynamic structural color tags for priority badges
  const getPriorityStyles = (priority) => {
    const pr = priority?.toLowerCase();
    if (pr === "high") return "bg-[var(--color-error-bg)] text-[var(--color-error)] border border-[var(--color-error-bg)]";
    if (pr === "medium") return "bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning-bg)]";
    return "bg-[var(--color-info-bg)] text-[var(--color-info)] border border-[var(--color-info-bg)]";
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans antialiased selection:bg-[var(--color-primary-subtle)] selection:text-[var(--color-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <header className="border-b border-[color:var(--color-border)] py-6 shadow-[dashed_var(--shadow-card)] flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[color:var(--color-text)] to-[color:var(--color-text-secondary)] bg-clip-text text-transparent">
              Recommendations
            </h1>
            
            <p className="text-[color:var(--color-text-secondary)] leading-relaxed text-sm md:text-base">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse autem dicta laborum reprehenderit fugit aliquam dolores dolor temporibus laboriosam id expedita voluptates, vero nostrum, numquam in magni animi voluptatem architecto!
            </p>
            
          </div>

          {!loading && remainingRequests && (
              <div className="mt-5 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">
                      AI Requests Remaining Today
                    </p>
                    <p className="mt-1 text-3xl font-bold text-primary">
                      {remainingRequests.remaining} / {remainingRequests.dailyLimit}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-text-secondary">
                      Used Today
                    </p>
                    <p className="mt-1 text-xl font-semibold text-text">
                      {remainingRequests.requestsMade}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-surface-2 px-3 py-2 text-sm text-text-secondary">
                  Your AI request limit resets automatically at <strong>12:00 AM</strong> each day.
                </div>
              </div>
            )}
          
         
        </header>
        
        {/* Header Block */}
        <section className="mb-8 mt-4 pb-6 border-b border-[var(--color-divider)]">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-wide text-[var(--color-text)]">
              Summary
            </h2>
            
          </div>
          {data?.summary && (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-text-secondary)]">
              {data.summary}
            </p>
          )}
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Action Items List */}
          <main className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-[var(--color-text)] tracking-wide">
              Strategic Recommendations
            </h2>
            
            <div className="space-y-4">
              {data?.recommendations?.map((item, idx) => (
                <div 
                  key={idx} 
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-card-hover)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-md px-2 py-0.5 text-xs font-medium uppercase tracking-wider ${getCategoryStyles(item.category)}`}>
                        {item.category}
                      </span>
                      <span className={`rounded-md px-2 py-0.5 text-xs font-medium uppercase tracking-wider ${getPriorityStyles(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                    {item.recommendation}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-divider)] text-xs">
                    <div>
                      <span className="block font-medium text-[var(--color-muted)] uppercase tracking-wider mb-1">
                        Context / Reason
                      </span>
                      <p className="text-[var(--color-text-secondary)] leading-normal">
                        {item.reason}
                      </p>
                    </div>
                    <div>
                      <span className="block font-medium text-[var(--color-muted)] uppercase tracking-wider mb-1">
                        Expected Impact
                      </span>
                      <p className="text-[var(--color-success)] font-medium leading-normal">
                        {item.expectedBenefit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>

          {/* Sidebar / Quick Actions Panel */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                Quick Wins
              </h2>
              <ul className="space-y-3">
                {data?.quickWins?.map((win, idx) => (
                  <li 
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-[var(--color-divider)] bg-[var(--color-surface-2)] p-3 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-hover)]"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary-subtle)] font-mono text-xs font-semibold text-[var(--color-primary)]">
                      {idx + 1}
                    </span>
                    <span className="leading-tight">{win}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
        
      </div>
    </div>
  );
};

export default Recommendation;