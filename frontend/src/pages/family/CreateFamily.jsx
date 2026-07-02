import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FamilyService from "../../services/family.service";
import { useAuth } from "../../hooks/useAuth";
import api from "../../axios/axios";
import { Users } from "lucide-react";
import toast from "react-hot-toast";

const CreateFamily = () => {
  const [familyName, setFamilyName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleCreate = async () => {
    if (!familyName.trim()) {
      toast.error("Please enter a family name");
      return;
    }

    const toastId = toast.loading("Creating family...");

    try {
      setLoading(true);

      const res = await FamilyService.createFamily({
        familyName,
      });

      if (res.success) {
        const res = await api.get("/user/me", { skipAuthRefresh: true });
        const user = res.data.user;

        console.log(user);

        if (!user) {
          toast.error("Session expired");
          navigate("/login", { replace: true });
          return;
        }

        setUser(user);

        toast.success("Family created successfully 🎉", {
          id: toastId,
        });

        navigate("/family");
      }
    } catch (err) {
      console.log(err);

      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create family",
        {
          id: toastId,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-[80vh] h-auto bg-bg flex items-center justify-center px-4 py-8">
    <div className="w-full max-w-md">
      <div className="bg-card border border-border rounded-3xl shadow-card overflow-hidden">
        <div className="p-8 border-b border-divider">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-subtle flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-text text-center">
            Create Family
          </h1>

          <p className="text-text-secondary text-center mt-2">
            Start managing finances together with your family members.
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Family Name
            </label>

            <input
              type="text"
              placeholder="e.g. Oswal Family"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-input-bg border border-input-border text-text placeholder:text-placeholder focus:outline-none focus:border-input-focus focus:ring-primary-subtle transition-all"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={loading || !familyName.trim()}
            className="w-full py-3.5 rounded-xl font-semibold bg-primary text-text-on-primary hover:bg-primary-hover active:bg-primary-active disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:cursor-pointer"
          >
            {loading ? "Creating Family..." : "Create Family"}
          </button>

          <button
            onClick={() => navigate("/family/setup")}
            className="w-full py-3 rounded-xl border border-border bg-surface text-text-secondary hover:bg-card-hover hover:text-text transition-all hover:cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default CreateFamily;