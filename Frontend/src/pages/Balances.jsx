import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaWallet } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";
import toast from "react-hot-toast";

// ====================
// Household ID
// ====================

const HOUSEHOLD_ID = "6af6280f520e2fe16c73d79d";

// ====================
// Currency Formatter
// ====================

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-BD").format(Math.abs(amount || 0));

function Balances() {
  const { t } = useLanguage();

  const [members, setMembers] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  // ====================
  // Fetch Balances
  // ====================

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await API.get(
          `/expenses/balances?householdId=${HOUSEHOLD_ID}`,
        );

        const data = response.data;

        const balanceList = data.balances || data.members || data.data || [];

        setMembers(balanceList);

        // Total expenses from members' paid amounts
        const totalPaid = balanceList.reduce(
          (total, member) =>
            total + Number(member.paid || member.totalPaid || 0),
          0,
        );

        setTotalExpenses(
          Number(data.totalExpenses ?? data.totalSpent ?? totalPaid),
        );
      } catch (error) {
        console.error("Fetch Balances Error:", error);

        toast.error(error.response?.data?.message || "Failed to load balances");
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, []);

  // ====================
  // Current User
  // ====================

  const storedUser =
    localStorage.getItem("hishabio-user") ||
    sessionStorage.getItem("hishabio-user");

  let currentUserId = "";

  try {
    currentUserId = storedUser
      ? JSON.parse(storedUser)?._id || JSON.parse(storedUser)?.id
      : "";
  } catch {
    currentUserId = "";
  }

  // ====================
  // Current User Balance
  // ====================

  const currentMember = members.find((member) => {
    const memberId = member.user?._id || member.user || member._id;

    return currentUserId && String(memberId) === String(currentUserId);
  });

  const myBalance = Number(
    currentMember?.balance ?? currentMember?.netBalance ?? 0,
  );

  const youWillReceive = myBalance > 0 ? myBalance : 0;
  const youOwe = myBalance < 0 ? Math.abs(myBalance) : 0;

  // ====================
  // Member Information
  // ====================

  const getMemberId = (member) => member.user?._id || member.user || member._id;

  const getMemberName = (member) =>
    member.user?.name || member.name || "Member";

  const getPaidAmount = (member) =>
    Number(member.paid ?? member.totalPaid ?? 0);

  const getShareAmount = (member) =>
    Number(member.share ?? member.totalShare ?? 0);

  const getBalance = (member) =>
    Number(member.balance ?? member.netBalance ?? 0);

  return (
    <div className="space-y-6">
      {/* ====================
          Page Header
          ==================== */}

      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
          {t("balances")}
        </h1>

        <p className="text-sm text-muted mt-2">{t("balanceSubtitle")}</p>
      </div>

      {/* ====================
          Balance Summary
          ==================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{t("totalExpenses")}</p>

            <FaWallet className="text-primary" />
          </div>

          <h2 className="text-2xl font-heading font-bold text-heading mt-4">
            {loading ? "..." : `৳${formatAmount(totalExpenses)}`}
          </h2>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{t("youWillReceive")}</p>

            <FaArrowDown className="text-success" />
          </div>

          <h2 className="text-2xl font-heading font-bold text-success mt-4">
            {loading ? "..." : `৳${formatAmount(youWillReceive)}`}
          </h2>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{t("youOwe")}</p>

            <FaArrowUp className="text-danger" />
          </div>

          <h2 className="text-2xl font-heading font-bold text-danger mt-4">
            {loading ? "..." : `৳${formatAmount(youOwe)}`}
          </h2>
        </div>
      </div>

      {/* ====================
          Member Balances
          ==================== */}

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-heading font-bold text-heading">
            {t("memberBalances")}
          </h2>

          <p className="text-sm text-muted mt-1">
            {t("memberBalancesDescription")}
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted">Loading balances...</div>
        ) : members.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-surface-hover text-muted text-sm">
                <tr>
                  <th className="px-5 py-4 font-semibold">{t("member")}</th>

                  <th className="px-5 py-4 font-semibold">{t("paid")}</th>

                  <th className="px-5 py-4 font-semibold">{t("share")}</th>

                  <th className="px-5 py-4 font-semibold">{t("netBalance")}</th>

                  <th className="px-5 py-4 font-semibold">{t("status")}</th>
                </tr>
              </thead>

              <tbody>
                {members.map((member) => {
                  const balance = getBalance(member);
                  const memberId = getMemberId(member);
                  const isYou =
                    currentUserId && String(memberId) === String(currentUserId);

                  return (
                    <tr
                      key={memberId}
                      className="border-t border-border hover:bg-surface-hover transition"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-heading">
                          {getMemberName(member)}
                        </div>

                        <div className="text-xs text-muted mt-1">
                          {isYou ? t("you") : t("member")}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-text">
                        ৳{formatAmount(getPaidAmount(member))}
                      </td>

                      <td className="px-5 py-4 text-text">
                        ৳{formatAmount(getShareAmount(member))}
                      </td>

                      <td
                        className={`px-5 py-4 font-semibold ${
                          balance > 0
                            ? "text-success"
                            : balance < 0
                              ? "text-danger"
                              : "text-muted"
                        }`}
                      >
                        {balance > 0 ? "+" : balance < 0 ? "-" : ""}৳
                        {formatAmount(balance)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            balance > 0
                              ? "bg-light-indigo text-primary"
                              : balance < 0
                                ? "bg-surface-hover text-danger"
                                : "bg-surface-hover text-muted"
                          }`}
                        >
                          {balance > 0
                            ? t("getsBack")
                            : balance < 0
                              ? t("owes")
                              : t("settled")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted">
            No balance information found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Balances;
