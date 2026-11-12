import { FaUsers, FaUserPlus, FaEllipsisH, FaCrown } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

function Members() {
  const { t } = useLanguage();

  const members = [
    {
      id: 1,
      name: "Salman Farshi",
      email: "salman@example.com",
      role: "Admin",
      paid: 5000,
      share: 3125,
      initials: "SF",
    },
    {
      id: 2,
      name: "Rahim Ahmed",
      email: "rahim@example.com",
      role: "Member",
      paid: 4000,
      share: 3125,
      initials: "RA",
    },
    {
      id: 3,
      name: "Karim Hasan",
      email: "karim@example.com",
      role: "Member",
      paid: 2000,
      share: 3125,
      initials: "KH",
    },
    {
      id: 4,
      name: "Hasan Mahmud",
      email: "hasan@example.com",
      role: "Member",
      paid: 1500,
      share: 3125,
      initials: "HM",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ====================
          Page Header
          ==================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
            {t("members")}
          </h1>

          <p className="text-sm text-muted mt-2">{t("membersSubtitle")}</p>
        </div>

        <button className="btn-primary">
          <FaUserPlus />
          {t("inviteMember")}
        </button>
      </div>

      {/* ====================
          Members Summary
          ==================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-light-indigo flex items-center justify-center text-primary text-xl">
            <FaUsers />
          </div>

          <div>
            <p className="text-sm text-muted">{t("totalMembers")}</p>
            <h2 className="text-2xl font-heading font-bold text-heading">4</h2>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center text-secondary text-xl">
            <FaCrown />
          </div>

          <div>
            <p className="text-sm text-muted">{t("householdAdmin")}</p>
            <h2 className="text-lg font-heading font-bold text-heading">
              Salman Farshi
            </h2>
          </div>
        </div>
      </div>

      {/* ====================
          Members List
          ==================== */}

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-heading font-bold text-heading">
            {t("householdMembers")}
          </h2>

          <p className="text-sm text-muted mt-1">
            {t("householdMembersDescription")}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
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
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-border hover:bg-surface-hover transition"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-light-indigo text-primary flex items-center justify-center font-bold text-sm">
                        {member.initials}
                      </div>

                      <div>
                        <p className="font-semibold text-heading">
                          {member.name}
                        </p>

                        <p className="text-xs text-muted mt-1">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        member.role === "Admin"
                          ? "bg-light-indigo text-primary"
                          : "bg-surface-hover text-text"
                      }`}
                    >
                      {member.role === "Admin" && <FaCrown />}
                      {member.role === "Admin" ? t("admin") : t("member")}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-text">
                    ৳{member.paid.toLocaleString()}
                  </td>

                  <td className="px-5 py-4 text-text">
                    ৳{member.share.toLocaleString()}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:bg-surface-hover hover:text-heading transition"
                      aria-label="Member actions"
                    >
                      <FaEllipsisH />
                    </button>
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

export default Members;
