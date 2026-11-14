import { useEffect, useState } from "react";
import {
  FaChartLine,
  FaWallet,
  FaCalendarAlt,
  FaDownload,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
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

function Reports() {
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const householdId = localStorage.getItem("hishabio-household-id");

  const categoryColors = [
    "#4F46E5",
    "#7C3AED",
    "#3B82F6",
    "#16A34A",
    "#D97706",
    "#DC2626",
    "#0891B2",
  ];

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
        console.error("Reports error:", error);
        toast.error(error.response?.data?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [householdId]);

  const formatMoney = (amount) =>
    `৳${Number(amount || 0).toLocaleString("en-IN")}`;

  const totalSpent = Number(dashboard?.totalSpent || 0);
  const monthlySpent = Number(dashboard?.monthlySpent || 0);

  const monthlyData = (dashboard?.monthlyExpenses || [])
    .slice(-6)
    .map((item) => ({
      month: item.month,
      amount: Number(item.expense || 0),
    }));

  const categoryMap = {};

  expenses.forEach((expense) => {
    const category = expense.category || "Others";
    categoryMap[category] =
      (categoryMap[category] || 0) + Number(expense.amount || 0);
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  const memberMap = {};

  expenses.forEach((expense) => {
    const memberName =
      expense.paidBy?.name || expense.paidBy?.email || "Unknown";

    memberMap[memberName] =
      (memberMap[memberName] || 0) + Number(expense.amount || 0);
  });

  const memberData = Object.entries(memberMap).map(([name, amount]) => ({
    name,
    amount,
  }));

  const activeMonths = monthlyData.filter((item) => item.amount > 0).length;

  const averageExpense = activeMonths
    ? monthlyData.reduce((sum, item) => sum + item.amount, 0) / activeMonths
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-muted">Loading reports...</p>
      </div>
    );
  }

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

      {/* Report Summary */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{t("totalExpenses")}</p>
            <FaWallet className="text-primary" />
          </div>

          <h2 className="text-2xl font-heading font-bold text-heading mt-4">
            {formatMoney(totalSpent)}
          </h2>

          <p className="text-xs text-muted mt-2">{t("thisMonth")}</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{t("averageExpense")}</p>
            <FaChartLine className="text-success" />
          </div>

          <h2 className="text-2xl font-heading font-bold text-heading mt-4">
            {formatMoney(averageExpense)}
          </h2>

          <p className="text-xs text-muted mt-2">{t("monthlyAverage")}</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{t("reportPeriod")}</p>
            <FaCalendarAlt className="text-secondary" />
          </div>

          <h2 className="text-xl font-heading font-bold text-heading mt-4">
            {t("lastSixMonths")}
          </h2>

          <p className="text-xs text-muted mt-2">
            {formatMoney(monthlySpent)} {t("thisMonth")}
          </p>
        </div>
      </div>

      {/* Monthly Expense Chart */}

      <div className="card p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-heading font-bold text-heading">
            {t("monthlyExpenseReport")}
          </h2>

          <p className="text-sm text-muted mt-1">
            {t("monthlyExpenseDescription")}
          </p>
        </div>

        <div className="w-full h-[300px]">
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />

                <XAxis dataKey="month" axisLine={false} tickLine={false} />

                <YAxis axisLine={false} tickLine={false} />

                <Tooltip
                  formatter={(value) => [formatMoney(value), t("amount")]}
                />

                <Bar
                  dataKey="amount"
                  fill="#4F46E5"
                  radius={[6, 6, 0, 0]}
                  barSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted text-center pt-20">
              No monthly expense data available.
            </p>
          )}
        </div>
      </div>

      {/* Category & Member Charts */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Category Chart */}

        <div className="card p-5 sm:p-6">
          <h2 className="text-lg font-heading font-bold text-heading">
            {t("categoryBreakdown")}
          </h2>

          <p className="text-sm text-muted mt-1">
            {t("categoryBreakdownDescription")}
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
                          fill={categoryColors[index % categoryColors.length]}
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
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            categoryColors[index % categoryColors.length],
                        }}
                      />

                      <span className="text-text">{item.name}</span>
                    </div>

                    <span className="font-semibold text-heading">
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
            {t("memberExpenseReport")}
          </h2>

          <p className="text-sm text-muted mt-1">
            {t("memberExpenseDescription")}
          </p>

          <div className="w-full h-[300px] mt-5">
            {memberData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={memberData}
                  layout="vertical"
                  margin={{ left: 10, right: 20 }}
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
                    width={65}
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
    </div>
  );
}

export default Reports;
