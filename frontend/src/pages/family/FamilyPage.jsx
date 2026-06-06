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

  
const { user } = useAuth(); // 👈 contains _id
  
  const navigate = useNavigate();

  let currentUser;

  // =========================
  // 🔵 GET FAMILY
  // =========================
  const fetchFamily = async () => {
    try {
      const res = await api.get("/family/me");
      if (res.data.success) {
        console.log(res.data.data);
        setFamily(res.data.data.familyId);
        setMembers(res.data.data.members);
        console.log(res.data.data);
        currentUser = members.find(m => m._id === user?._id);
        
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFamily();
  }, []);

  // =========================
  // 🟢 CREATE FAMILY
  // =========================
  const handleCreateFamily = async () => {
    try {
      setLoading(true);
      const res = await api.post("/family/create", {
        familyName,
      });

      if (res.data.success) {
        setFamily(res.data.data);
        fetchFamily();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🔐 GENERATE INVITE
  // =========================
  const handleGenerateInvite = async () => {
    try {
      const res = await api.post("/family/invite");
      if (res.data.success) {
        setInviteLink(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // 🟡 JOIN FAMILY
  // =========================
  const extractToken = (input) => {
  try {
    const url = new URL(input);
    return url.searchParams.get("token");
  } catch {
    return input; // already a raw token
  }
};

const handleJoinFamily = async () => {
  try {
    setLoading(true);

    const cleanToken = extractToken(joinToken);

    const res = await api.post(`/family/join?token=${cleanToken}`);

    if (res.data.success) {
      fetchFamily();
    }
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};





const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied!");
  } catch (err) {
    toast.error("Failed to copy");
    console.error(err);
  }
};
  // =========================
  // 🧠 UI
  // =========================
  return (
    <div className="min-h-screen bg-bg text-text p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ========================= */}
        {/* 🔵 FAMILY DETAILS */}
        {/* ========================= */}
        {family && (
          <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">
              {family.familyName}
            </h2>

            {/* Invite */}
            <button
              onClick={handleGenerateInvite}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg"
            >
              Generate Invite Link
            </button>

            {inviteLink && (
              <div className="flex items-center gap-4 bg-bg border border-border p-3 rounded-lg text-sm">
                
                <span className="flex-1 break-all">
                  {inviteLink}
                </span>

                <button
                  onClick={handleCopy}
                  className="bg-primary hover:bg-primary-hover text-white p-2 rounded-lg text-xs"
                >
                  <Copy size={15} />
                </button>

              </div>
            )}

            {/* Members */}
            <div>
              <h3 className="font-semibold mb-2">Members</h3>
              <div className="space-y-2">
                {members.map((m) => (
                  <div
                    key={m._id}
                    className="flex justify-between items-center bg-bg border border-border rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-sm text-muted">{m.email}</p>
                    </div>
                    <span className="text-sm text-muted">
                      {m.role}
                    </span>
                    {/* 🔴 REMOVE BUTTON */}
      {currentUser?.role === "familyAdmin" && user?._id !== m._id && (
        <button
          onClick={() => navigate(`/family/remove/${m._id}`)}
          className="bg-error hover:bg-error-hover text-white px-3 py-1 rounded-lg text-sm"
        >
          Remove
        </button>
      )}

                  </div>
                ))}
              </div>
            </div>


          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyPage;



/**

// 🟢 NO FAMILY
        
 {!family && (
          <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">Create or Join Family</h2>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter family name"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full border border-border bg-bg rounded-lg p-2"
              />
              <button
                onClick={handleCreateFamily}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg"
              >
                Create Family
              </button>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter invite token"
                value={joinToken}
                onChange={(e) => setJoinToken(e.target.value)}
                className="w-full border border-border bg-bg rounded-lg p-2"
              />
              <button
                onClick={handleJoinFamily}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg"
              >
                Join Family
              </button>
            </div>
          </div>
        )}

 */