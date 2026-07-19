import { useNavigate } from "react-router-dom";
import AIService from "../../services/ai.service";
import { Activity, Lightbulb, BarChart2Icon, } from "lucide-react";
import { useEffect, useState } from "react";

const AIFeatures = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Financial Health",
      description: "Analyze your overall financial status and health score.",
      path: "/ai/financial-health",
      icon: Activity,
    },
    {
      title: "Benchmark",
      description: "Compare your financial metrics against market standards.",
      path: "/ai/benchmark",
      icon: BarChart2Icon,
    },
    {
      title: "Recommendation",
      description: "Get personalized, AI-driven tips to optimize your budget.",
      path: "/ai/recommendation",
      icon: Lightbulb,
    },
  ];

  const [remainingRequests, setRemainingRequests] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRemainingRequests = async () => {
      try {
        const res = await AIService.getRemainingAIRequests();
        setRemainingRequests(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRemainingRequests();
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-text">
            AI Features
          </h1>

          <p className="text-text-secondary mt-2">
            Select an AI-powered module to inspect and optimize your financial
            portfolio.
          </p>

          {!loading && remainingRequests && (
            <div className="mt-5 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">
                    AI Requests Remaining Today
                  </p>
                  <p className="mt-1 text-3xl font-bold text-primary">
                    {remainingRequests.remainingRequests} / {remainingRequests.dailyLimit}
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

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.path}
              className="bg-card rounded-xl p-6 shadow-card transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Visual Icon Header */}
                <div className="text-2xl mb-4 bg-surface-2 w-12 h-12 flex items-center justify-center rounded-lg border border-border">
                  { <feature.icon/>}
                </div>
                <h2 className="text-xl font-semibold mb-2 text-text">
                  {feature.title}
                </h2>
                <p className="text-sm text-text-secondary line-clamp-3">
                  {feature.description}
                </p>
              </div>

              {/* Navigation Action Button */}
              <button
                onClick={() => navigate(feature.path)}
                className="mt-6 w-full py-2.5 px-4 rounded-xl bg-primary-subtle text-primary hover:bg-primary-subtle/70 font-medium  transition-colors duration-150 cursor-pointer text-center"
              >
                Launch {feature.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIFeatures;