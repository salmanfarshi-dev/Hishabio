import { useLanguage } from "../context/LanguageContext";

import StatsCards from "../components/dashboard/StatsCards";
import RecentExpenses from "../components/dashboard/RecentExpenses";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import QuickActions from "../components/dashboard/QuickActions";

function Dashboard() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* ====================
          Welcome Section
          ==================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-heading mb-2">
            {t("welcome")}
          </h1>

          <p className="text-sm text-muted">{t("dashboardSubtitle")}</p>
        </div>

        <div className="text-sm text-muted bg-surface border border-border rounded-xl px-4 py-2 w-fit">
          {t("thisMonth")}: November 2026
        </div>
      </div>

      {/* ====================
          Summary Cards
          ==================== */}

      <StatsCards />

      {/* ====================
          Chart And Quick Actions
          ==================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ====================
            Monthly Expense Chart
            ==================== */}

        <div className="xl:col-span-2 min-w-0">
          <ExpenseChart />
        </div>

        {/* ====================
            Quick Actions
            ==================== */}

        <div className="xl:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* ====================
          Recent Expenses
          ==================== */}

      <RecentExpenses />
    </div>
  );
}

export default Dashboard;
