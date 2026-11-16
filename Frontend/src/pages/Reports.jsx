import { useEffect, useMemo, useState } from "react";
import {
  FaChartLine,
  FaWallet,
  FaCalendarAlt,
  FaDownload,
  FaReceipt,
  FaArrowUp,
  FaFilter,
  FaTimes,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const CATEGORY_COLORS = [
  "#4F46E5",
  "#7C3AED",
  "#3B82F6",
  "#16A34A",
  "#D97706",
  "#DC2626",
  "#0891B2",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Reports() {
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  const currentDate = new Date();

  const [selectedYear, setSelectedYear] = useState(
    String(currentDate.getFullYear()),
  );

  const [selectedMonth, setSelectedMonth] = useState("all");

  const householdId = localStorage.getItem("hishabio-household-id");

  // =========================
  // Fetch Report Data
  // =========================

  useEffect(() => {
    const fetchReports = async () => {
      if (!householdId) {
        window.location.href = "/household-setup";
        return;
      }

      try {
        setLoading(true);

        const [dashboardRes, expensesRes] = await Promise.all([
          API.get(`/dashboard/summary?householdId=${householdId}`),
          API.get(`/expenses?householdId=${householdId}`),
        ]);

        setDashboard(dashboardRes.data.dashboard || dashboardRes.data);

        const expenseList =
          expensesRes.data.expenses || expensesRes.data.data || [];

        setExpenses(Array.isArray(expenseList) ? expenseList : []);
      } catch (error) {
        console.error("Reports Error:", error);

        toast.error(error.response?.data?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [householdId]);

  // =========================
  // Format Functions
  // =========================

  const formatMoney = (amount) => {
    return `৳${Number(amount || 0).toLocaleString("en-BD", {
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // Available Years
  // =========================

  const availableYears = useMemo(() => {
    const years = expenses
      .filter((expense) => expense.date)
      .map((expense) => String(new Date(expense.date).getFullYear()));

    return [...new Set([String(currentDate.getFullYear()), ...years])].sort(
      (a, b) => Number(b) - Number(a),
    );
  }, [expenses]);

  // =========================
  // Filter Expenses
  // =========================

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      if (!expense.date) return false;

      const expenseDate = new Date(expense.date);

      const yearMatches = expenseDate.getFullYear() === Number(selectedYear);

      const monthMatches =
        selectedMonth === "all" ||
        expenseDate.getMonth() === Number(selectedMonth);

      return yearMatches && monthMatches;
    });
  }, [expenses, selectedYear, selectedMonth]);

  // =========================
  // Summary Calculations
  // =========================

  const totalSpent = useMemo(() => {
    return filteredExpenses.reduce(
      (total, expense) => total + Number(expense.amount || 0),
      0,
    );
  }, [filteredExpenses]);

  const totalCount = filteredExpenses.length;

  const averageExpense = totalCount ? totalSpent / totalCount : 0;

  const highestExpense = filteredExpenses.reduce(
    (highest, expense) => Math.max(highest, Number(expense.amount || 0)),
    0,
  );

  // =========================
  // Monthly Expense Data
  // =========================

  const monthlyData = useMemo(() => {
    const monthMap = {};

    MONTHS.forEach((month, index) => {
      monthMap[index] = {
        month: month.slice(0, 3),
        amount: 0,
      };
    });

    expenses.forEach((expense) => {
      if (!expense.date) return;

      const date = new Date(expense.date);

      if (date.getFullYear() !== Number(selectedYear)) {
        return;
      }

      const monthIndex = date.getMonth();

      monthMap[monthIndex].amount += Number(expense.amount || 0);
    });

    return Object.values(monthMap);
  }, [expenses, selectedYear]);

  // =========================
  // Category Data
  // =========================

  const categoryData = useMemo(() => {
    const categoryMap = {};

    filteredExpenses.forEach((expense) => {
      const category = expense.category || "Others";

      categoryMap[category] =
        (categoryMap[category] || 0) + Number(expense.amount || 0);
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredExpenses]);

  // =========================
  // Member Data
  // =========================

  const memberData = useMemo(() => {
    const memberMap = {};

    filteredExpenses.forEach((expense) => {
      const memberName =
        expense.paidBy?.name || expense.paidBy?.email || "Unknown";

      memberMap[memberName] =
        (memberMap[memberName] || 0) + Number(expense.amount || 0);
    });

    return Object.entries(memberMap)
      .map(([name, amount]) => ({
        name,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses]);

  // =========================
  // Top Category
  // =========================

  const topCategory = categoryData.length ? categoryData[0] : null;

  // =========================
  // Clear Filters
  // =========================

  const handleClearFilters = () => {
    setSelectedYear(String(currentDate.getFullYear()));
    setSelectedMonth("all");
  };

  const isFiltered =
    selectedMonth !== "all" ||
    selectedYear !== String(currentDate.getFullYear());

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading reports...</p>
        </div>
      </div>
    );
  }

  // =========================
  // Main UI
  // =========================

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
            {t("reports")}
          </h1>

          <p className="text-sm text-muted mt-2">{t("reportsSubtitle")}</p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => window.print()}
        >
          <FaDownload />
          {t("exportReport")}
        </button>
      </div>

      {/* Filters */}

      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FaFilter />
            </div>

            <div>
              <h2 className="font-heading font-bold text-heading">
                Report Filters
              </h2>

              <p className="text-xs text-muted mt-1">Select a month and year</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:w-auto">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-3 rounded-xl border border-border bg-background text-heading outline-none focus:border-primary"
            >
              <option value="all">All Months</option>

              {MONTHS.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-3 rounded-xl border border-border bg-background text-heading outline-none focus:border-primary"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isFiltered && (
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <FaTimes size={12} />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Total Expenses</p>

            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FaWallet />
            </div>
          </div>

          <h2 className="text-2xl font-heading font-bold text-heading mt-4">
            {formatMoney(totalSpent)}
          </h2>

          <p className="text-xs text-muted mt-2">Total amount spent</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Average Expense</p>

            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <FaChartLine />
            </div>
          </div>

          <h2 className="text-2xl font-heading font-bold text-heading mt-4">
            {formatMoney(averageExpense)}
          </h2>

          <p className="text-xs text-muted mt-2">Average per transaction</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Total Transactions</p>

            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FaReceipt />
            </div>
          </div>

          <h2 className="text-2xl font-heading font-bold text-heading mt-4">
            {totalCount}
          </h2>

          <p className="text-xs text-muted mt-2">Recorded expenses</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Highest Expense</p>

            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <FaArrowUp />
            </div>
          </div>

          <h2 className="text-2xl font-heading font-bold text-heading mt-4">
            {formatMoney(highestExpense)}
          </h2>

          <p className="text-xs text-muted mt-2">Single highest transaction</p>
        </div>
      </div>

      {/* Monthly Expense Analysis */}

      <div className="card p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-heading font-bold text-heading">
            Monthly Expense Analysis
          </h2>

          <p className="text-sm text-muted mt-1">
            Monthly spending overview for {selectedYear}
          </p>
        </div>

        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />

              <XAxis dataKey="month" axisLine={false} tickLine={false} />

              <YAxis axisLine={false} tickLine={false} />

              <Tooltip formatter={(value) => [formatMoney(value), "Expense"]} />

              <Bar
                dataKey="amount"
                fill="#4F46E5"
                radius={[6, 6, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Expense Trend */}

      <div className="card p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-heading font-bold text-heading">
            Monthly Expense Trend
          </h2>

          <p className="text-sm text-muted mt-1">
            Track how your spending changes throughout the year
          </p>
        </div>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />

              <XAxis dataKey="month" axisLine={false} tickLine={false} />

              <YAxis axisLine={false} tickLine={false} />

              <Tooltip formatter={(value) => [formatMoney(value), "Expense"]} />

              <Line
                type="monotone"
                dataKey="amount"
                stroke="#7C3AED"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#7C3AED",
                }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category & Member Charts */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Category Chart */}

        <div className="card p-5 sm:p-6">
          <h2 className="text-lg font-heading font-bold text-heading">
            Category-wise Spending
          </h2>

          <p className="text-sm text-muted mt-1">
            See where your household money goes
          </p>

          {categoryData.length > 0 ? (
            <>
              <div className="w-full h-[260px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                    >
                      {categoryData.map((item, index) => (
                        <Cell
                          key={item.name}
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip formatter={(value) => formatMoney(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {categoryData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                        }}
                      />

                      <span className="text-text truncate">{item.name}</span>
                    </div>

                    <span className="font-semibold text-heading shrink-0">
                      {formatMoney(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted text-center py-16">
              No category data available.
            </p>
          )}
        </div>

        {/* Member Chart */}

        <div className="card p-5 sm:p-6">
          <h2 className="text-lg font-heading font-bold text-heading">
            Member-wise Expenses
          </h2>

          <p className="text-sm text-muted mt-1">
            Compare spending paid by each household member
          </p>

          <div className="w-full h-[300px] mt-5">
            {memberData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={memberData}
                  layout="vertical"
                  margin={{
                    left: 10,
                    right: 20,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#E2E8F0"
                  />

                  <XAxis type="number" axisLine={false} tickLine={false} />

                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    width={85}
                  />

                  <Tooltip formatter={(value) => formatMoney(value)} />

                  <Bar
                    dataKey="amount"
                    fill="#7C3AED"
                    radius={[0, 6, 6, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted text-center pt-20">
                No member expense data available.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Top Category & Report Information */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="text-sm text-muted">Highest Spending Category</p>

          <h2 className="text-xl font-heading font-bold text-heading mt-3">
            {topCategory?.name || "No data"}
          </h2>

          <p className="text-sm text-primary font-semibold mt-2">
            {formatMoney(topCategory?.value || 0)}
          </p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-primary" />

            <p className="text-sm text-muted">Report Period</p>
          </div>

          <h2 className="text-xl font-heading font-bold text-heading mt-3">
            {selectedMonth === "all"
              ? selectedYear
              : `${MONTHS[Number(selectedMonth)]} ${selectedYear}`}
          </h2>

          <p className="text-sm text-muted mt-2">
            {totalCount} transactions · {formatMoney(totalSpent)}
          </p>
        </div>
      </div>

      {/* Recent Expenses */}

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-heading font-bold text-heading">
            Expense Details
          </h2>

          <p className="text-sm text-muted mt-1">
            Transactions included in this report
          </p>
        </div>

        {filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background">
                <tr className="text-xs text-muted uppercase">
                  <th className="px-5 py-4">Title</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Paid By</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Amount</th>
                </tr>
              </thead>

              <tbody>
                {[...filteredExpenses]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((expense) => (
                    <tr
                      key={expense._id}
                      className="border-t border-border hover:bg-background/70 transition"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-heading">
                        {expense.title}
                      </td>

                      <td className="px-5 py-4 text-sm text-text">
                        {expense.category || "Others"}
                      </td>

                      <td className="px-5 py-4 text-sm text-text">
                        {expense.paidBy?.name || "Unknown"}
                      </td>

                      <td className="px-5 py-4 text-sm text-text whitespace-nowrap">
                        {formatDate(expense.date)}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-heading whitespace-nowrap">
                        {formatMoney(expense.amount)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-14 px-5">
            <FaReceipt className="text-3xl text-muted mx-auto mb-3" />

            <p className="text-heading font-semibold">No expenses found</p>

            <p className="text-sm text-muted mt-2">
              No transactions available for this report period.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
