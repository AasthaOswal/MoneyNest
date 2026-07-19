import { useNavigate } from "react-router-dom";
import AIService from "../../services/ai.service";

const AIFeatures = () => {
  const navigate = useNavigate();



  return (
    <div>
      <h1>AI Features</h1>

      <button
        onClick={()=>navigate("/ai/financial-health")}
      >
        Financial Health
      </button>

      <button
        onClick={()=>navigate("/ai/benchmark")}
      >
        Benchmark
      </button>

      <button
        onClick={()=>navigate("/ai/recommendation")}
      >
        Recommendation
      </button>
    </div>
  );
};

export default AIFeatures;