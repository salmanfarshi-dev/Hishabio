import { useState } from "react";
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

function Expenses() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const expenses = [
    {
      id: 1,
      title: "Monthly Grocery",
      category: "food",
      paidBy: "Salman",
      date: "Nov 12, 2026",
      amount: 2500,
      icon: FaShoppingBag,
    },
    {
      id: 2,
      title: "Dinner",
      category: "food",
      paidBy: "Rahim",
      date: "Nov 11, 2026",
      amount: 1200,
      icon: FaUtensils,
    },
    {
      id: 3,
      title: "Electricity Bill",
      category: "utilities",
      paidBy: "Karim",
      date: "Nov 10, 2026",
      amount: 1800,
      icon: FaBolt,
    },
    {
      id: 4,
      title: "Bus Fare",
      category: "transport",
      paidBy: "Salman",
      date: "Nov 09, 2026",
      amount: 300,
      icon: FaBus,
    },
    {
      id: 5,
      title: "Shopping",
      category: "shopping",
      paidBy: "Rahim",
      date: "Nov 08, 2026",
      amount: 2200,
      icon: FaShoppingBag,
    },
  ];

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = category === "all" || expense.category === category;

    return matchesSearch && matchesCategory;
  });

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

        {filteredExpenses.length > 0 ? (
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
                  const Icon = expense.icon;

                  return (
                    <tr
                      key={expense.id}
                      className="border-t border-border hover:bg-background/70 transition"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-[170px]">
                          <div className="w-10 h-10 rounded-xl bg-light-indigo text-primary flex items-center justify-center shrink-0">
                            <Icon />
                          </div>

                          <span className="text-sm font-semibold text-heading">
                            {expense.title}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-text">
                        {t(expense.category)}
                      </td>

                      <td className="px-5 py-4 text-sm text-text">
                        {expense.paidBy}
                      </td>

                      <td className="px-5 py-4 text-sm text-muted whitespace-nowrap">
                        {expense.date}
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-heading whitespace-nowrap">
                        ৳{expense.amount.toLocaleString("en-BD")}
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
