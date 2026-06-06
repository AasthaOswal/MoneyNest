import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FamilyService from "../../services/family.service";
import toast from "react-hot-toast";

const RemoveFamilyMember = () => {
  const location = useLocation();
  const { memberId } = useParams();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        // If member came through navigate state
        if (location.state?.member) {
          setMember(location.state.member);
          setLoading(false);
          return;
        }

        // Refresh case
        const res = await FamilyService.getFamilyMember(memberId);

        console.log(res)

        setMember(res.data);
      } catch (err) {
        console.error(err);

        toast.error(
          err?.response?.data?.message ||
          "Error fetching member details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId, location.state]);

  const handleRemoveMember = async ()=>{

    const toastId = toast.loading("Please wait....");
    try{
        const res = await FamilyService.removeFamilyMember(memberId);

        console.log(res)

        toast.success(res.message || "Removed Member successfully", {id:toastId});

        navigate("/family/manage");
        

    }catch(error){
        console.error(error);
        toast.error(error.message ||"Error in removing Family Member", {id:toastId});
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!member) {
    return <div>Member not found</div>;
  }

  return (
  <div className="min-h-screen flex items-center justify-center p-6 bg-(--color-bg)">
    <div
      className="w-full max-w-lg rounded-2xl border shadow-lg p-8"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Warning Icon */}
      <div className="flex justify-center mb-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{
            backgroundColor: "var(--color-error-bg)",
            color: "var(--color-error)",
          }}
        >
          ⚠️
        </div>
      </div>

      {/* Title */}
      <h1
        className="text-2xl font-bold text-center mb-2"
        style={{ color: "var(--color-text)" }}
      >
        Remove Family Member
      </h1>

      <p
        className="text-center mb-6"
        style={{ color: "var(--color-text-secondary)" }}
      >
        This action will remove the member from your family.
      </p>

      {/* Member Card */}
      <div
        className="rounded-xl p-4 mb-6"
        style={{
          backgroundColor: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div
          className="text-sm mb-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Member Name
        </div>

        <div
          className="font-semibold text-lg mb-3"
          style={{ color: "var(--color-text)" }}
        >
          {member.name}
        </div>

        <div
          className="text-sm mb-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Email
        </div>

        <div style={{ color: "var(--color-text)" }}>
          {member.email}
        </div>
      </div>

      {/* Warning Box */}
      <div
        className="rounded-xl p-4 mb-6"
        style={{
          backgroundColor: "var(--color-error-bg)",
          border: "1px solid var(--color-error)",
        }}
      >
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-error)" }}
        >
          Are you sure?
        </p>

        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-text)" }}
        >
          Once removed, this member will lose access to family data and
          shared resources.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 px-4 py-3 rounded-xl font-medium transition"
          style={{
            backgroundColor: "var(--color-surface-2)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleRemoveMember}
          className="flex-1 px-4 py-3 rounded-xl font-semibold transition"
          style={{
            backgroundColor: "var(--color-error)",
            color: "var(--color-bg)",
          }}
        >
          Remove Member
        </button>
      </div>
    </div>
  </div>
);

 
};

export default RemoveFamilyMember;