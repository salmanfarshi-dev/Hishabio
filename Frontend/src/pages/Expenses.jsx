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

import { Link, useNavigate } from "react-router-dom";
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
  transport: {
    icon: FaBus,
    color: "bg-blue-50 text-info",
  },
  shopping: {
    icon: FaShoppingBag,
    color: "bg-purple-50 text-secondary",
  },
  utilities: {
    icon: FaBolt,
    color: "bg-yellow-50 text-warning",
  },
  rent: {
    icon: FaBolt,
    color: "bg-indigo-50 text-primary",
  },
  entertainment: {
    icon: FaEllipsisH,
    color: "bg-pink-50 text-secondary",
  },
  others: {
    icon: FaEllipsisH,
    color: "bg-gray-100 text-gray-500",
  },
};

function Expenses() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // ====================
  // States
  // ====================

  const [openMenu, setOpenMenu] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [sortBy, setSortBy] = useState("latest");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ====================
  // Fetch Expenses
  // ====================

  useEffect(() => {
    const fetchExpenses = async () => {
      const householdId = localStorage.getItem("hishabio-household-id");

      if (!householdId) {
        navigate("/household-setup", { replace: true });
        return;
      }

      try {
        setLoading(true);

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
  }, [navigate]);

  // ====================
  // Delete Expense
  // ====================

  const handleDelete = async (expenseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/expenses/${expenseId}`);

      setExpenses((previous) =>
        previous.filter((expense) => expense._id !== expenseId),
      );

      setOpenMenu(null);

      toast.success("Expense deleted successfully!");
    } catch (error) {
      console.error("Delete Expense Error:", error);

      toast.error(error.response?.data?.message || "Failed to delete expense");
    }
  };

  // ====================
  // Clear Filters
  // ====================

  const handleClearFilters = () => {
    setSearch("");
    setCategory("all");
    setStartDate("");
    setEndDate("");
    setSortBy("latest");
    setCurrentPage(1);
  };

  // ====================
  // Search And Filter
  // ====================

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || expense.category?.toLowerCase() === category;

    const expenseDate = expense.date
      ? new Date(expense.date).toISOString().slice(0, 10)
      : "";

    const matchesStartDate = !startDate || expenseDate >= startDate;

    const matchesEndDate = !endDate || expenseDate <= endDate;

    return (
      matchesSearch && matchesCategory && matchesStartDate && matchesEndDate
    );
  });

  // ====================
  // Sorting
  // ====================

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.date) - new Date(b.date);

      case "highest":
        return Number(b.amount) - Number(a.amount);

      case "lowest":
        return Number(a.amount) - Number(b.amount);

      case "latest":
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  // ====================
  // Expense Summary
  // ====================

  const totalExpenses = sortedExpenses.length;

  const totalAmount = sortedExpenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0,
  );

  const averageExpense = totalExpenses > 0 ? totalAmount / totalExpenses : 0;

  // ====================
  // Pagination
  // ====================

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedExpenses = sortedExpenses.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, startDate, endDate, sortBy]);

  // Keep current page valid after deleting an expense
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

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

  // ====================
  // UI
  // ====================

  return (
    <div className="space-y-6">
      {/* Page Header */}

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

      {/* Expense Summary */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-sm text-muted">Total Expenses</p>

          <h3 className="text-2xl font-bold text-heading mt-2">
            {totalExpenses}
          </h3>
        </div>

        <div className="card p-5">
          <p className="text-sm text-muted">Total Amount</p>

          <h3 className="text-2xl font-bold text-heading mt-2">
            ৳{formatAmount(totalAmount)}
          </h3>
        </div>

        <div className="card p-5">
          <p className="text-sm text-muted">Average Expense</p>

          <h3 className="text-2xl font-bold text-heading mt-2">
            ৳{formatAmount(averageExpense)}
          </h3>
        </div>
      </div>

      {/* Search And Filter */}

      <div className="card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_150px_170px_170px_190px_140px] gap-3 items-end">
        {/* Search */}

        <div className="relative w-full min-w-0">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchExpenses")}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-heading outline-none focus:border-primary transition"
          />
        </div>

        {/* Category */}

        <div className="w-full min-w-0">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-border bg-background text-heading outline-none focus:border-primary"
          >
            <option value="all">{t("allCategories")}</option>

            <option value="food">{t("food")}</option>
            <option value="transport">{t("transport")}</option>
            <option value="shopping">{t("shopping")}</option>
            <option value="utilities">{t("utilities")}</option>
            <option value="rent">Rent</option>
            <option value="entertainment">Entertainment</option>
            <option value="others">{t("others")}</option>
          </select>
        </div>

        {/* Start Date */}

        <div className="w-full min-w-0">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-heading mb-2"
          >
            Start Date
          </label>

          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => {
              const value = e.target.value;
              setStartDate(value);

              if (endDate && value > endDate) {
                setEndDate("");
              }
            }}
            className="w-full px-3 py-3 rounded-xl border border-border bg-background text-heading outline-none focus:border-primary"
          />
        </div>

        {/* End Date */}

        <div className="w-full min-w-0">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-heading mb-2"
          >
            End Date
          </label>

          <input
            id="endDate"
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-border bg-background text-heading outline-none focus:border-primary"
          />
        </div>

        {/* Sorting */}

        <div className="w-full min-w-0">
          <label
            htmlFor="sortBy"
            className="block text-sm font-medium text-heading mb-2"
          >
            Sort By
          </label>

          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-border bg-background text-heading outline-none focus:border-primary"
          >
            <option value="latest">Latest Date</option>
            <option value="oldest">Oldest Date</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>

        {/* Clear Filters */}

        <button
          type="button"
          onClick={handleClearFilters}
          className="w-full px-4 py-3 rounded-xl border border-border text-heading hover:bg-background transition whitespace-nowrap"
        >
          Clear Filters
        </button>
      </div>

      {/* Expenses Table */}

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-heading font-bold text-heading">
            {t("expenseDetails")}
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted">Loading expenses...</div>
        ) : sortedExpenses.length > 0 ? (
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
                {paginatedExpenses.map((expense) => {
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
                      {/* Expense Title */}

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

                      {/* Category */}

                      <td className="px-5 py-4 text-sm text-text">
                        {t(categoryKey) || expense.category}
                      </td>

                      {/* Paid By */}

                      <td className="px-5 py-4 text-sm text-text">
                        {expense.paidBy?.name || "Unknown"}
                      </td>

                      {/* Date */}

                      <td className="px-5 py-4 text-sm text-muted whitespace-nowrap">
                        {formatDate(expense.date)}
                      </td>

                      {/* Amount */}

                      <td className="px-5 py-4 text-sm font-bold text-heading whitespace-nowrap">
                        ৳{formatAmount(expense.amount)}
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4 relative">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === expense._id ? null : expense._id,
                              )
                            }
                            className="text-muted hover:text-primary transition"
                            title={t("edit")}
                          >
                            <FaEllipsisH />
                          </button>

                          {openMenu === expense._id && (
                            <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-border bg-surface shadow-lg p-1">
                              <Link
                                to={`/expenses/edit/${expense._id}`}
                                onClick={() => setOpenMenu(null)}
                                className="block w-full px-3 py-2 text-sm text-heading hover:bg-background rounded-lg"
                              >
                                Edit Expense
                              </Link>

                              <button
                                type="button"
                                onClick={() => handleDelete(expense._id)}
                                className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-background rounded-lg"
                              >
                                Delete Expense
                              </button>
                            </div>
                          )}
                        </div>
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

      {/* Pagination */}

      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            Showing {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, sortedExpenses.length)} of{" "}
            {sortedExpenses.length} expenses
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 rounded-lg border border-border text-heading disabled:opacity-40 disabled:cursor-not-allowed hover:bg-background"
            >
              Previous
            </button>

            <span className="text-sm font-medium text-heading">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 rounded-lg border border-border text-heading disabled:opacity-40 disabled:cursor-not-allowed hover:bg-background"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Expenses;
