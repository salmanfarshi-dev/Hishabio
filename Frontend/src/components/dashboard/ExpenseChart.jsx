import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useLanguage } from "../../context/LanguageContext";

function ExpenseChart() {
  const { t, language } = useLanguage();

  const data = [
    { month: "Jan", expense: 6500 },
    { month: "Feb", expense: 8200 },
    { month: "Mar", expense: 7200 },
    { month: "Apr", expense: 9500 },
    { month: "May", expense: 7800 },
    { month: "Jun", expense: 11000 },
    { month: "Jul", expense: 9200 },
    { month: "Aug", expense: 12500 },
    { month: "Sep", expense: 10500 },
    { month: "Oct", expense: 14000 },
    { month: "Nov", expense: 12500 },
    { month: "Dec", expense: 15000 },
  ];

  return (
    <div className="card p-5 sm:p-6">
      {/* ====================
          Chart Header
          ==================== */}

      <div className="mb-6">
        <h2 className="text-lg font-heading font-bold text-heading">
          {t("monthlyExpenses")}
        </h2>

        <p className="text-xs text-muted mt-1">{t("expenseTrend")}</p>
      </div>

      {/* ====================
          Expense Chart
          ==================== */}

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#E2E8F0"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              tickFormatter={(value) => `৳${value / 1000}k`}
            />

            <Tooltip
              formatter={(value) => [
                `৳${Number(value).toLocaleString("en-BD")}`,
                language === "bn" ? "খরচ" : "Expense",
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                fontSize: "13px",
              }}
            />

            <Area
              type="monotone"
              dataKey="expense"
              stroke="#4F46E5"
              strokeWidth={3}
              fill="url(#expenseGradient)"
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExpenseChart;
