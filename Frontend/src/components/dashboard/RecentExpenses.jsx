import {
  FaUtensils,
  FaBus,
  FaShoppingBag,
  FaBolt,
  FaEllipsisH,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

// ====================
// Category Icons
// ====================

const categoryStyles = {
  food: {
    icon: FaUtensils,
    color: "bg-orange-50 text-warning",
  },
  groceries: {
    icon: FaShoppingBag,
    color: "bg-light-indigo text-primary",
  },
  shopping: {
    icon: FaShoppingBag,
    color: "bg-purple-50 text-secondary",
  },
  utilities: {
    icon: FaBolt,
    color: "bg-yellow-50 text-warning",
  },
  transport: {
    icon: FaBus,
    color: "bg-blue-50 text-info",
  },
};

function RecentExpenses({ expenses = [] }) {
  const { t } = useLanguage();

  // ====================
  // Currency Formatter
  // ====================

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-BD").format(amount || 0);
  };

  // ====================
  // Date Formatter
  // ====================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="card p-5 sm:p-6">
      {/* ====================
          Section Header
          ==================== */}

      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-heading font-bold text-heading">
            {t("recentExpenses")}
          </h2>

          <p className="text-xs text-muted mt-1">{t("thisMonth")}</p>
        </div>

        <Link
          to="/expenses"
          className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition"
        >
          {t("viewAll")}
          <FaArrowRight size={12} />
        </Link>
      </div>

      {/* ====================
          Expense List
          ==================== */}

      <div className="space-y-1">
        {expenses.length > 0 ? (
          expenses.map((expense) => {
            const category = expense.category?.toLowerCase();

            const style = categoryStyles[category] || {
              icon: FaEllipsisH,
              color: "bg-light-indigo text-primary",
            };

            const Icon = style.icon;

            return (
              <div
                key={expense._id}
                className="flex items-center justify-between gap-3 py-4 border-b border-border last:border-0"
              >
                {/* ====================
                    Expense Information
                    ==================== */}

                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${style.color}`}
                  >
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-heading truncate">
                      {expense.title}
                    </h3>

                    <p className="text-xs text-muted mt-1">
                      {t(category) || expense.category} •{" "}
                      {expense.paidBy?.name || "Unknown"} •{" "}
                      {formatDate(expense.date)}
                    </p>
                  </div>
                </div>

                {/* ====================
                    Expense Amount
                    ==================== */}

                <div className="text-right shrink-0">
                  <p className="text-sm font-heading font-bold text-heading">
                    ৳{formatAmount(expense.amount)}
                  </p>

                  <p className="text-xs text-muted mt-1">{t("amount")}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <FaShoppingBag className="text-3xl text-muted mx-auto mb-3" />

            <p className="text-sm font-semibold text-heading">
              No expenses yet
            </p>

            <p className="text-xs text-muted mt-1">
              Your recent expenses will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentExpenses;
