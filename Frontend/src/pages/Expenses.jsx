import { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaUtensils,
  FaBus,
  FaShoppingBag,
  FaBolt,
  FaEllipsisH,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";
import toast from "react-hot-toast";

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

function Expenses() {
  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ====================
  // Fetch Expenses
  // ====================

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const householdId = "6af6280f520e2fe16c73d79d";

        const response = await API.get(`/expenses?householdId=${householdId}`);

        setExpenses(response.data.expenses || response.data.data || []);
      } catch (error) {
        console.error("Fetch Expenses Error:", error);

        toast.error(error.response?.data?.message || "Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // ====================
  // Search And Filter
  // ====================

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || expense.category?.toLowerCase() === category;

    return matchesSearch && matchesCategory;
  });

  // ====================
  // Format Date
  // ====================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ====================
  // Format Amount
  // ====================

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-BD").format(amount || 0);
  };

  return (
    <div className="space-y-6">
      {/* ====================
          Page Header
          ==================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
            {t("allExpenses")}
          </h1>

          <p className="text-sm text-muted mt-2">{t("manageExpenses")}</p>
        </div>

        <Link to="/expenses/add" className="btn-primary">
          <FaPlus size={13} />
          {t("addNew")}
        </Link>
      </div>

      {/* ====================
          Search And Filter
          ==================== */}

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchExpenses")}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-heading outline-none focus:border-primary transition"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-3 rounded-xl border border-border bg-background text-heading outline-none focus:border-primary"
        >
          <option value="all">{t("allCategories")}</option>
          <option value="food">{t("food")}</option>
          <option value="transport">{t("transport")}</option>
          <option value="shopping">{t("shopping")}</option>
          <option value="utilities">{t("utilities")}</option>
          <option value="others">{t("others")}</option>
        </select>
      </div>

      {/* ====================
          Expenses Table
          ==================== */}

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-heading font-bold text-heading">
            {t("expenseDetails")}
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted">Loading expenses...</div>
        ) : filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background">
                <tr className="text-xs text-muted uppercase">
                  <th className="px-5 py-4">{t("expenseTitle")}</th>
                  <th className="px-5 py-4">{t("category")}</th>
                  <th className="px-5 py-4">{t("paidBy")}</th>
                  <th className="px-5 py-4">{t("date")}</th>
                  <th className="px-5 py-4">{t("amount")}</th>
                  <th className="px-5 py-4">{t("edit")}</th>
                </tr>
              </thead>

              <tbody>
                {filteredExpenses.map((expense) => {
                  const categoryKey = expense.category?.toLowerCase();

                  const style = categoryStyles[categoryKey] || {
                    icon: FaEllipsisH,
                    color: "bg-light-indigo text-primary",
                  };

                  const Icon = style.icon;

                  return (
                    <tr
                      key={expense._id}
                      className="border-t border-border hover:bg-background/70 transition"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-[170px]">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.color}`}
                          >
                            <Icon />
                          </div>

                          <span className="text-sm font-semibold text-heading">
                            {expense.title}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-text">
                        {t(categoryKey) || expense.category}
                      </td>

                      <td className="px-5 py-4 text-sm text-text">
                        {expense.paidBy?.name || "Unknown"}
                      </td>

                      <td className="px-5 py-4 text-sm text-muted whitespace-nowrap">
                        {formatDate(expense.date)}
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-heading whitespace-nowrap">
                        ৳{formatAmount(expense.amount)}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          className="text-muted hover:text-primary transition"
                          title={t("edit")}
                        >
                          <FaEllipsisH />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted">
            {t("noExpensesFound")}
          </div>
        )}
      </div>
    </div>
  );
}

export default Expenses;
