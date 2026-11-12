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

function Reports() {
  const { t } = useLanguage();

  const monthlyData = [
    { month: "Jan", amount: 8500 },
    { month: "Feb", amount: 10500 },
    { month: "Mar", amount: 7800 },
    { month: "Apr", amount: 12000 },
    { month: "May", amount: 9500 },
    { month: "Jun", amount: 12500 },
  ];

  const categoryData = [
    { name: "Food", value: 5000 },
    { name: "Transport", value: 2000 },
    { name: "Shopping", value: 2500 },
    { name: "Utilities", value: 2000 },
    { name: "Others", value: 1000 },
  ];

  const categoryColors = [
    "#4F46E5",
    "#7C3AED",
    "#3B82F6",
    "#16A34A",
    "#D97706",
  ];

  const memberData = [
    { name: "Salman", amount: 5000 },
    { name: "Rahim", amount: 4000 },
    { name: "Karim", amount: 2000 },
    { name: "Hasan", amount: 1500 },
  ];

  return (
    <div className="space-y-6">
      {/* ====================
          Page Header
          ==================== */}

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

      {/* ====================
          Report Summary
          ==================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{t("totalExpenses")}</p>
            <FaWallet className="text-primary" />
          </div>

          <h2 className="text-2xl font-heading font-bold text-heading mt-4">
            ৳12,500
          </h2>

          <p className="text-xs text-muted mt-2">{t("thisMonth")}</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{t("averageExpense")}</p>
            <FaChartLine className="text-success" />
          </div>

          <h2 className="text-2xl font-heading font-bold text-heading mt-4">
            ৳2,083
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

          <p className="text-xs text-muted mt-2">January - June 2026</p>
        </div>
      </div>

      {/* ====================
          Monthly Expense Chart
          ==================== */}

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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />

              <XAxis dataKey="month" axisLine={false} tickLine={false} />

              <YAxis axisLine={false} tickLine={false} />

              <Tooltip formatter={(value) => [`৳${value}`, t("amount")]} />

              <Bar
                dataKey="amount"
                fill="#4F46E5"
                radius={[6, 6, 0, 0]}
                barSize={35}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ====================
          Category & Member Charts
          ==================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Category Chart */}

        <div className="card p-5 sm:p-6">
          <h2 className="text-lg font-heading font-bold text-heading">
            {t("categoryBreakdown")}
          </h2>

          <p className="text-sm text-muted mt-1">
            {t("categoryBreakdownDescription")}
          </p>

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
                    <Cell key={item.name} fill={categoryColors[index]} />
                  ))}
                </Pie>

                <Tooltip formatter={(value) => `৳${value}`} />
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
                    style={{ backgroundColor: categoryColors[index] }}
                  />

                  <span className="text-text">
                    {t(item.name.toLowerCase())}
                  </span>
                </div>

                <span className="font-semibold text-heading">
                  ৳{item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
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

                <Tooltip formatter={(value) => `৳${value}`} />

                <Bar
                  dataKey="amount"
                  fill="#7C3AED"
                  radius={[0, 6, 6, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
