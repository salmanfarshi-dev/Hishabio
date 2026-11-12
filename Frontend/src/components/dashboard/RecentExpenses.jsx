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

function RecentExpenses() {
  const { t } = useLanguage();

  const expenses = [
    {
      id: 1,
      title: "Monthly Grocery",
      category: "food",
      paidBy: "Salman",
      date: "Nov 12, 2026",
      amount: 2500,
      icon: FaShoppingBag,
      color: "bg-light-indigo text-primary",
    },
    {
      id: 2,
      title: "Dinner",
      category: "food",
      paidBy: "Rahim",
      date: "Nov 11, 2026",
      amount: 1200,
      icon: FaUtensils,
      color: "bg-orange-50 text-warning",
    },
    {
      id: 3,
      title: "Electricity Bill",
      category: "utilities",
      paidBy: "Karim",
      date: "Nov 10, 2026",
      amount: 1800,
      icon: FaBolt,
      color: "bg-yellow-50 text-warning",
    },
    {
      id: 4,
      title: "Bus Fare",
      category: "transport",
      paidBy: "Salman",
      date: "Nov 09, 2026",
      amount: 300,
      icon: FaBus,
      color: "bg-blue-50 text-info",
    },
    {
      id: 5,
      title: "Shopping",
      category: "shopping",
      paidBy: "Rahim",
      date: "Nov 08, 2026",
      amount: 2200,
      icon: FaShoppingBag,
      color: "bg-purple-50 text-secondary",
    },
  ];

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
        {expenses.map((expense) => {
          const Icon = expense.icon;

          return (
            <div
              key={expense.id}
              className="flex items-center justify-between gap-3 py-4 border-b border-border last:border-0"
            >
              {/* ====================
                  Expense Information
                  ==================== */}

              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${expense.color}`}
                >
                  <Icon size={17} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-heading truncate">
                    {expense.title}
                  </h3>

                  <p className="text-xs text-muted mt-1">
                    {t(expense.category)} • {expense.paidBy} • {expense.date}
                  </p>
                </div>
              </div>

              {/* ====================
                  Expense Amount
                  ==================== */}

              <div className="text-right shrink-0">
                <p className="text-sm font-heading font-bold text-heading">
                  ৳{expense.amount.toLocaleString("en-BD")}
                </p>

                <p className="text-xs text-muted mt-1">{t("amount")}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentExpenses;
