import { useEffect, useState } from "react";
import api from "../../axios/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const FamilyPage = () => {
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [familyName, setFamilyName] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [joinToken, setJoinToken] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const currentUser = members.find(
    (m) => m._id === user?._id
  );

  // =========================
  // GET FAMILY
  // =========================
  const fetchFamily = async () => {
    try {
      const res = await api.get("/family/me");

      if (res.data.success) {
        setFamily(res.data.data.familyId);
        setMembers(res.data.data.members);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFamily();
  }, []);

  // =========================
  // CREATE FAMILY
  // =========================
  const handleCreateFamily = async () => {
    const toastId = toast.loading("Creating family...");

    try {
      setLoading(true);

      const res = await api.post("/family/create", {
        familyName,
      });

      if (res.data.success) {
        await fetchFamily();

        toast.success("Family created successfully!", {
          id: toastId,
        });

        setFamilyName("");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to create family",
        {
          id: toastId,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GENERATE INVITE
  // =========================
  const handleGenerateInvite = async () => {
    const toastId = toast.loading(
      "Generating invite link..."
    );

    try {
      const res = await api.post("/family/invite");

      if (res.data.success) {
        setInviteLink(res.data.data);

        toast.success("Invite link generated!", {
          id: toastId,
        });
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to generate invite link",
        {
          id: toastId,
        }
      );
    }
  };

  // =========================
  // JOIN FAMILY
  // =========================
  const extractToken = (input) => {
    try {
      const url = new URL(input);
      return url.searchParams.get("token");
    } catch {
      return input;
    }
  };

  const handleJoinFamily = async () => {
    const toastId = toast.loading(
      "Joining family..."
    );

    try {
      setLoading(true);

      const cleanToken = extractToken(joinToken);

      const res = await api.post(
        `/family/join?token=${cleanToken}`
      );

      if (res.data.success) {
        await fetchFamily();

        toast.success("Joined family successfully!", {
          id: toastId,
        });

        setJoinToken("");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to join family",
        {
          id: toastId,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // COPY LINK
  // =========================
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Invite link copied!");
    } catch (err) {
      toast.error("Failed to copy invite link");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto p-6 space-y-6">


        {/* ========================= */}
        {/* FAMILY DETAILS */}
        {/* ========================= */}
        {family && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  {family.familyName}
                </h2>

                <p className="text-text-secondary mt-1">
                  Manage and share expenses with
                  your family members.
                </p>
              </div>

              <button
                onClick={handleGenerateInvite}
                className="
                  self-start
                  px-4 py-2
                  rounded-xl
                  bg-primary
                  text-text-on-primary
                  hover:bg-primary-hover
                  transition-colors
                  font-medium
                "
              >
                Generate Invite Link
              </button>
            </div>

            {/* Invite Box */}
            <div
              className="
                flex items-center gap-3
                rounded-xl
                border border-border
                bg-surface-2
                p-4
                mb-8
              "
            >
              <span
                className={`flex-1 break-all ${
                  !inviteLink
                    ? "text-muted"
                    : "text-text"
                }`}
              >
                {inviteLink ||
                  "Generate an invite link and share it with your family members."}
              </span>

              <button
                onClick={handleCopy}
                disabled={!inviteLink}
                className="
                  p-2
                  rounded-lg
                  border border-border
                  bg-surface
                  hover:bg-card-hover
                  disabled:opacity-50
                  transition-colors
                "
              >
                <Copy
                  size={16}
                  className="text-primary"
                />
              </button>
            </div>

            {/* Members */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Family Members
              </h3>

              <div className="space-y-3">
                {members.map((m) => (
                  <div
                    key={m._id}
                    className="
                      flex items-center justify-between
                      bg-surface-2
                      border border-border
                      rounded-xl
                      p-4
                      hover:bg-card-hover
                      transition-colors
                    "
                  >
                    <div>
                      <p className="font-medium">
                        {m.name}
                      </p>

                      <p className="text-sm text-text-secondary">
                        {m.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className="
                          px-3 py-1
                          rounded-full
                          text-xs
                          font-medium
                          bg-primary-subtle
                          text-primary
                        "
                      >
                        {m.role}
                      </span>

                
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================= */}
        {/* NO FAMILY */}
        {/* ========================= */}
        {!family && (
          <><div>Please join a family</div></>
        )}
      </div>
    </div>
  );
};

export default FamilyPage;