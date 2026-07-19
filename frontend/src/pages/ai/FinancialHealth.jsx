import { useEffect, useState } from "react";
import AIService from "../../services/ai.service";

const FinancialHealth = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFinancialHealth = async () => {
      try {
        const response = await AIService.getAIFeature("financialHealth");
        setData(response.data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialHealth();
  }, []);

  if (loading) return <p>Generating AI insights...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Financial Health</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default FinancialHealth;