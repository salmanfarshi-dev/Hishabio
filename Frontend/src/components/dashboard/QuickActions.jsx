import { Link } from "react-router-dom";
import { FaPlus, FaBalanceScale, FaArrowRight } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

function QuickActions() {
  const { t } = useLanguage();

  const actions = [
    {
      title: t("addNewExpense"),
      description: t("addExpenseDescription"),
      path: "/expenses/add",
      icon: FaPlus,
      iconBg: "bg-light-indigo",
      iconColor: "text-primary",
    },
    {
      title: t("checkYourBalance"),
      description: t("balanceDescription"),
      path: "/balances",
      icon: FaBalanceScale,
      iconBg: "bg-green-50",
      iconColor: "text-success",
    },
  ];

  return (
    <div className="card p-5 sm:p-6">
      {/* ====================
          Section Header
          ==================== */}

      <h2 className="text-lg font-heading font-bold text-heading mb-5">
        {t("quickActions")}
      </h2>

      {/* ====================
          Action Cards
          ==================== */}

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.path}
              to={action.path}
              className="flex items-center justify-between gap-3 p-4 rounded-xl border border-border hover:border-primary hover:bg-light-indigo/40 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${action.iconBg} ${action.iconColor}`}
                >
                  <Icon size={18} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-heading">
                    {action.title}
                  </h3>

                  <p className="text-xs text-muted mt-1">
                    {action.description}
                  </p>
                </div>
              </div>

              <FaArrowRight
                className="text-muted group-hover:text-primary group-hover:translate-x-1 transition shrink-0"
                size={13}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
