import { useNavigate } from "react-router-dom";
import AIService from "../../services/ai.service";
import { Activity, Lightbulb, BarChart2Icon, } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-bg text-text p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-text">
            AI Features
          </h1>
          <p className="text-text-secondary mt-2">
            Select an AI-powered module to inspect and optimize your financial portfolio.
          </p>
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