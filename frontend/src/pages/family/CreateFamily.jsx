import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FamilyService from "../../services/family.service";
import { useAuth } from "../../context/AuthContext";
import api from "../../axios/axios";

const CreateFamily = () => {
  const [familyName, setFamilyName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleCreate = async () => {
    if (!familyName.trim()) return;

    try {
      setLoading(true);

      const res = await FamilyService.createFamily({
        familyName,
      });

      if (res.success) {
       const res = await api.get("/user/me", { skipAuthRefresh: true });
        const user = res.data.user;
        console.log(user)

        if(!user){
          navigate("/login", { replace: true });
        }

        setUser(user);
        
        navigate("/family");
      }
    } catch (err) {
      console.log(err);
      alert(err.message || "Failed to create family");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center p-6">
      <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-md space-y-6">

        <h2 className="text-xl font-semibold text-center">
          Create Family
        </h2>

        <input
          type="text"
          placeholder="Enter family name"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          className="w-full border border-border bg-bg rounded-lg p-3"
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg"
        >
          {loading ? "Creating..." : "Create Family"}
        </button>

        <button
          onClick={() => navigate("/family/setup")}
          className="w-full text-muted text-sm"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default CreateFamily;