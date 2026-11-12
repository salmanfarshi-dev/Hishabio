import { FaArrowDown, FaArrowUp, FaWallet } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

function Balances() {
  const { t } = useLanguage();

  const members = [
    {
      id: 1,
      name: "Salman Farshi",
      role: "You",
      paid: 5000,
      share: 3125,
      balance: 1875,
    },
    {
      id: 2,
      name: "Rahim",
      role: "Member",
      paid: 4000,
      share: 3125,
      balance: 875,
    },
    {
      id: 3,
      name: "Karim",
      role: "Member",
      paid: 2000,
      share: 3125,
      balance: -1125,
    },
    {
      id: 4,
      name: "Hasan",
      role: "Member",
      paid: 1500,
      share: 3125,
      balance: -1625,
    },
  ];

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
            ৳12,500
          </h2>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{t("youWillReceive")}</p>
            <FaArrowDown className="text-success" />
          </div>

          <h2 className="text-2xl font-heading font-bold text-success mt-4">
            ৳1,875
          </h2>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{t("youOwe")}</p>
            <FaArrowUp className="text-danger" />
          </div>

          <h2 className="text-2xl font-heading font-bold text-danger mt-4">
            ৳0
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
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-border hover:bg-surface-hover transition"
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-heading">
                      {member.name}
                    </div>

                    <div className="text-xs text-muted mt-1">
                      {member.role === "You" ? t("you") : t("member")}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-text">
                    ৳{member.paid.toLocaleString()}
                  </td>

                  <td className="px-5 py-4 text-text">
                    ৳{member.share.toLocaleString()}
                  </td>

                  <td
                    className={`px-5 py-4 font-semibold ${
                      member.balance > 0
                        ? "text-success"
                        : member.balance < 0
                          ? "text-danger"
                          : "text-muted"
                    }`}
                  >
                    {member.balance > 0 ? "+" : ""}৳
                    {member.balance.toLocaleString()}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        member.balance > 0
                          ? "bg-light-indigo text-primary"
                          : member.balance < 0
                            ? "bg-surface-hover text-danger"
                            : "bg-surface-hover text-muted"
                      }`}
                    >
                      {member.balance > 0
                        ? t("getsBack")
                        : member.balance < 0
                          ? t("owes")
                          : t("settled")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Balances;
