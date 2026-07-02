import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FamilyService from "../../services/family.service";
import { useAuth } from "../../hooks/useAuth";
import api from "../../axios/axios";
import toast from "react-hot-toast";

import { Users } from "lucide-react";

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
    if (!tokenInput.trim()) {
      toast.error("Please enter an invite link or token");
      return;
    }

    const toastId = toast.loading("Joining family...");

    try {
      setLoading(true);

      const token = extractToken(tokenInput);

      const response = await FamilyService.joinFamilyWithToken({
        token,
      });

      if (response.success) {
        const userResponse = await api.get("/user/me", {
          skipAuthRefresh: true,
        });

        const user = userResponse.data.user;

        if (!user) {
          toast.error("Session expired", {
            id: toastId,
          });
          navigate("/login", { replace: true });
          return;
        }

        setUser(user);

        toast.success("Successfully joined family!", {
          id: toastId,
        });

        navigate("/family");
      }
    } catch (err) {
      console.log(err);

      toast.error(
        err?.message || "Failed to join family",
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

          {/* Header */}
          <div className="p-8 border-b border-divider">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-subtle flex items-center justify-center mb-5">
            <Users className="w-8 h-8 text-primary" />
          </div>

            <h1 className="text-2xl font-bold text-text text-center">
              Join Family
            </h1>

            <p className="text-text-secondary text-sm text-center mt-2">
              Paste your invite link or family token to join an existing family.
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Invite Link or Token
              </label>

              <input
                type="text"
                placeholder="Paste it here"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="
                  w-full
                  bg-input-bg
                  border
                  border-input-border
                  rounded-xl
                  px-4
                  py-3
                  text-text
                  placeholder:text-placeholder
                  outline-none
                  transition-all
                  focus:border-input-focus
                  focus:ring-2
                  focus:ring-primary-subtle
                "
              />

              <p className="text-xs text-muted mt-2">
                You can paste either the full invite link or just the token.
              </p>
            </div>

            <button
              onClick={handleJoin}
              disabled={loading}
              className="
                w-full
                bg-primary
                hover:bg-primary-hover
                active:bg-primary-active
                text-text-on-primary
                font-semibold
                py-3.5
                rounded-xl
                transition-all
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Joining Family..." : "Join Family"}
            </button>

            <button
              onClick={() => navigate("/family/setup")}
              disabled={loading}
              className="
                w-full
                border
                border-border
                hover:border-border-hover
                bg-surface
                hover:bg-surface-2
                text-text-secondary
                py-3
                rounded-xl
                transition-all
              "
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinFamily;