import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaUserPlus, FaCrown, FaCopy, FaTrash } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";
import toast from "react-hot-toast";

function Members() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [balances, setBalances] = useState([]);
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState("");

  // ====================
  // Member Information
  // ====================

  const getMemberUser = (member) => member.user || member;

  const getMemberId = (member) => {
    const user = getMemberUser(member);
    return user?._id || user?.id || "";
  };

  const getMemberName = (member) => {
    const user = getMemberUser(member);
    return user?.name || member.name || "Member";
  };

  const getMemberEmail = (member) => {
    const user = getMemberUser(member);
    return user?.email || member.email || "";
  };

  const getMemberImage = (member) => {
    const user = getMemberUser(member);
    return user?.profileImage || "";
  };

  const getMemberRole = (member) =>
    String(member.role || "member").toLowerCase();

  const getInitials = (name) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");

  // ====================
  // Fetch Members & Balances
  // ====================

  useEffect(() => {
    const fetchData = async () => {
      const householdId = localStorage.getItem("hishabio-household-id");

      if (!householdId) {
        navigate("/household-setup", { replace: true });
        return;
      }

      try {
        setLoading(true);

        const [
          membersResponse,
          householdResponse,
          currentUserResponse,
          balancesResponse,
        ] = await Promise.all([
          API.get(`/households/${householdId}/members`),
          API.get(`/households/${householdId}`),
          API.get("/auth/me"),
          API.get(`/expenses/balances?householdId=${householdId}`),
        ]);

        const memberList =
          membersResponse.data.members || membersResponse.data.data || [];

        const householdData =
          householdResponse.data.household ||
          householdResponse.data.data ||
          householdResponse.data;

        const currentUser =
          currentUserResponse.data.user ||
          currentUserResponse.data.data ||
          currentUserResponse.data;

        const currentUserId = currentUser?._id || currentUser?.id;

        const creatorId =
          typeof householdData.createdBy === "object"
            ? householdData.createdBy?._id || householdData.createdBy?.id
            : householdData.createdBy;

        const balanceList = balancesResponse.data.balances || [];

        setMembers(memberList);
        setHousehold(householdData);
        setBalances(balanceList);

        setIsOwner(
          Boolean(
            currentUserId &&
            creatorId &&
            String(currentUserId) === String(creatorId),
          ),
        );
      } catch (error) {
        console.error("Fetch Members Error:", error);

        toast.error(error.response?.data?.message || "Failed to load members");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // ====================
  // Combine Active & Removed Members
  // ====================

  const activeMemberIds = new Set(
    members.map((member) => String(getMemberId(member))),
  );

  const displayMembers = [...members];

  balances.forEach((balance) => {
    const user = balance.user;

    if (!user?._id) return;

    const alreadyExists = displayMembers.some(
      (member) => String(getMemberId(member)) === String(user._id),
    );

    if (!alreadyExists) {
      displayMembers.push({
        user,
        role: "removed",
      });
    }
  });

  // ====================
  // Copy Invite Code
  // ====================

  const handleInvite = async () => {
    if (!household?.inviteCode) {
      toast.error("Invite code not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(household.inviteCode);

      toast.success("Invite code copied!");
    } catch (error) {
      console.error("Copy Invite Code Error:", error);
      toast.error("Could not copy invite code");
    }
  };

  // ====================
  // Remove Member
  // ====================

  const handleRemoveMember = async (memberId, memberName) => {
    if (!isOwner) {
      toast.error("Only the household owner can remove members");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${memberName} from this household?`,
    );

    if (!confirmed) return;

    try {
      setRemovingMemberId(memberId);

      const householdId = localStorage.getItem("hishabio-household-id");

      await API.delete(`/households/${householdId}/members/${memberId}`);

      setMembers((previousMembers) =>
        previousMembers.filter(
          (member) => String(getMemberId(member)) !== String(memberId),
        ),
      );

      toast.success("Member removed successfully");

      // Refresh balance data to preserve historical records
      const balanceResponse = await API.get(
        `/expenses/balances?householdId=${householdId}`,
      );

      setBalances(balanceResponse.data.balances || []);
    } catch (error) {
      console.error("Remove Member Error:", error);

      toast.error(error.response?.data?.message || "Failed to remove member");
    } finally {
      setRemovingMemberId("");
    }
  };

  // ====================
  // Admin Information
  // ====================

  const adminMember = members.find(
    (member) => getMemberRole(member) === "admin",
  );

  const adminName = adminMember ? getMemberName(adminMember) : "Not available";

  // ====================
  // UI
  // ====================

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
            {t("members")}
          </h1>

          <p className="text-sm text-muted mt-2">{t("membersSubtitle")}</p>
        </div>

        <button onClick={handleInvite} className="btn-primary">
          <FaUserPlus />
          {t("inviteMember")}
        </button>
      </div>

      {/* Members Summary */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-light-indigo flex items-center justify-center text-primary text-xl">
            <FaUsers />
          </div>

          <div>
            <p className="text-sm text-muted">{t("totalMembers")}</p>

            <h2 className="text-2xl font-heading font-bold text-heading">
              {loading ? "..." : members.length}
            </h2>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center text-secondary text-xl">
            <FaCrown />
          </div>

          <div>
            <p className="text-sm text-muted">{t("householdAdmin")}</p>

            <h2 className="text-lg font-heading font-bold text-heading">
              {loading ? "..." : adminName}
            </h2>
          </div>
        </div>
      </div>

      {/* Invite Code */}

      {household?.inviteCode && (
        <div className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-heading">
              Household Invite Code
            </h3>

            <p className="text-sm text-muted mt-1">
              Share this code with people you want to invite.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-lg bg-surface-hover text-primary font-bold tracking-wider">
              {household.inviteCode}
            </span>

            <button
              type="button"
              onClick={handleInvite}
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-light-indigo text-primary hover:bg-surface-hover transition"
              aria-label="Copy invite code"
            >
              <FaCopy />
            </button>
          </div>
        </div>
      )}

      {/* Members List */}

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-heading font-bold text-heading">
            {t("householdMembers")}
          </h2>

          <p className="text-sm text-muted mt-1">
            {t("householdMembersDescription")}
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted">Loading members...</div>
        ) : displayMembers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-surface-hover text-muted text-sm">
                <tr>
                  <th className="px-5 py-4 font-semibold">{t("member")}</th>

                  <th className="px-5 py-4 font-semibold">{t("role")}</th>

                  <th className="px-5 py-4 font-semibold">{t("paid")}</th>

                  <th className="px-5 py-4 font-semibold">{t("share")}</th>

                  <th className="px-5 py-4 font-semibold">{t("actions")}</th>
                </tr>
              </thead>

              <tbody>
                {displayMembers.map((member) => {
                  const memberId = getMemberId(member);
                  const name = getMemberName(member);
                  const email = getMemberEmail(member);
                  const image = getMemberImage(member);

                  const isActive = activeMemberIds.has(String(memberId));

                  const role = isActive ? getMemberRole(member) : "removed";

                  const isAdmin = role === "admin";

                  const memberBalance = balances.find(
                    (item) => String(item.user?._id) === String(memberId),
                  );

                  const totalPaid = memberBalance?.totalPaid || 0;

                  const totalShare = memberBalance?.totalShare || 0;

                  return (
                    <tr
                      key={memberId}
                      className="border-t border-border hover:bg-surface-hover transition"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {image ? (
                            <img
                              src={image}
                              alt={name}
                              className={`w-10 h-10 rounded-full object-cover ${
                                !isActive ? "grayscale opacity-60" : ""
                              }`}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-light-indigo text-primary flex items-center justify-center font-bold text-sm">
                              {getInitials(name)}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-heading">{name}</p>

                            <p className="text-xs text-muted mt-1">{email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {isActive ? (
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                              isAdmin
                                ? "bg-light-indigo text-primary"
                                : "bg-surface-hover text-text"
                            }`}
                          >
                            {isAdmin && <FaCrown />}
                            {isAdmin ? t("admin") : t("member")}
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600">
                            Removed
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-muted">
                        ৳{Number(totalPaid).toFixed(2)}
                      </td>

                      <td className="px-5 py-4 text-muted">
                        ৳{Number(totalShare).toFixed(2)}
                      </td>

                      <td className="px-5 py-4">
                        {isOwner && isActive && !isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(memberId, name)}
                            disabled={removingMemberId === memberId}
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={`Remove ${name}`}
                            title="Remove member"
                          >
                            {removingMemberId === memberId ? (
                              <span className="text-xs">...</span>
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted">
            No household members found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Members;
