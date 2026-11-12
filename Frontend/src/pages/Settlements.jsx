import { FaArrowRight, FaCheckCircle, FaClock, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Settlements() {
  const { t } = useLanguage();

  const settlements = [
    {
      id: 1,
      from: "Karim",
      to: "Salman Farshi",
      amount: 1125,
      date: "Nov 10, 2026",
      status: "Completed",
    },
    {
      id: 2,
      from: "Hasan",
      to: "Rahim",
      amount: 625,
      date: "Nov 11, 2026",
      status: "Pending",
    },
    {
      id: 3,
      from: "Hasan",
      to: "Salman Farshi",
      amount: 1000,
      date: "Nov 12, 2026",
      status: "Pending",
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
            {t("settlements")}
          </h1>

          <p className="text-sm text-muted mt-2">{t("settlementSubtitle")}</p>
        </div>

        <button className="btn-primary">
          <FaPlus />
          {t("recordSettlement")}
        </button>
      </div>

      {/* ====================
          Settlement Summary
          ==================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="card p-5">
          <p className="text-sm text-muted">{t("totalSettlements")}</p>
          <h2 className="text-2xl font-heading font-bold text-heading mt-3">
            ৳2,750
          </h2>
        </div>

        <div className="card p-5">
          <p className="text-sm text-muted">{t("completedSettlements")}</p>
          <h2 className="text-2xl font-heading font-bold text-success mt-3">
            ৳1,125
          </h2>
        </div>

        <div className="card p-5">
          <p className="text-sm text-muted">{t("pendingSettlements")}</p>
          <h2 className="text-2xl font-heading font-bold text-warning mt-3">
            ৳1,625
          </h2>
        </div>
      </div>

      {/* ====================
          Settlement History
          ==================== */}

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-heading font-bold text-heading">
            {t("settlementHistory")}
          </h2>

          <p className="text-sm text-muted mt-1">
            {t("settlementHistoryDescription")}
          </p>
        </div>

        <div className="divide-y divide-border">
          {settlements.map((item) => (
            <div
              key={item.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-hover transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-light-indigo flex items-center justify-center text-primary">
                  <FaArrowRight />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-heading">
                      {item.from}
                    </span>

                    <FaArrowRight className="text-muted text-xs" />

                    <span className="font-semibold text-heading">
                      {item.to}
                    </span>
                  </div>

                  <p className="text-xs text-muted mt-1">{item.date}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5">
                <h3 className="font-heading font-bold text-heading">
                  ৳{item.amount.toLocaleString()}
                </h3>

                <span
                  className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full ${
                    item.status === "Completed"
                      ? "bg-light-indigo text-success"
                      : "bg-surface-hover text-warning"
                  }`}
                >
                  {item.status === "Completed" ? (
                    <FaCheckCircle />
                  ) : (
                    <FaClock />
                  )}

                  {item.status === "Completed" ? t("completed") : t("pending")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ====================
          Balance Link
          ==================== */}

      <div className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-heading">
            {t("checkYourBalances")}
          </h3>

          <p className="text-sm text-muted mt-1">{t("balanceDescription")}</p>
        </div>

        <Link to="/balances" className="btn-primary">
          {t("viewBalances")}
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
}

export default Settlements;
