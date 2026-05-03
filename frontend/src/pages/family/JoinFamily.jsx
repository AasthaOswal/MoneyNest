import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FamilyService from "../../services/family.service";
import { useAuth } from "../../context/AuthContext";
import api from "../../axios/axios";
import toast from "react-hot-toast";

const JoinFamily = () => {
  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const extractToken = (input) => {
    try {
      const url = new URL(input);
      return url.searchParams.get("token");
    } catch {
      return input;
    }
  };
  

  const handleJoin = async () => {
    if (!tokenInput.trim()) return;

    try {
      setLoading(true);

      const token = extractToken(tokenInput);

      const res = await FamilyService.joinFamilyWithToken({
        token,
      });

      if (res.success) {
        toast.success("Family joined successfully");
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
      toast.error(err.message || "Failed to join family");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center p-6">
      <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-md space-y-6">

        <h2 className="text-xl font-semibold text-center">
          Join Family
        </h2>

        <input
          type="text"
          placeholder="Paste invite link or token"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          className="w-full border border-border bg-bg rounded-lg p-3"
        />

        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg"
        >
          {loading ? "Joining..." : "Join Family"}
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

export default JoinFamily;