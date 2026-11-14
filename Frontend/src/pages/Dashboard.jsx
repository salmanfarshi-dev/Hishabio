import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";

import StatsCards from "../components/dashboard/StatsCards";
import RecentExpenses from "../components/dashboard/RecentExpenses";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import QuickActions from "../components/dashboard/QuickActions";

function Dashboard() {
  const { t } = useLanguage();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Temporary household ID for testing
  const householdId = "6af6280f520e2fe16c73d79d";

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          `/dashboard/summary?householdId=${householdId}`,
        );

        setDashboard(response.data.dashboard);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 text-center">
        <p className="text-danger font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-5 py-2 bg-primary text-white rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

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
          {dashboard.householdName}
        </div>
      </div>

      <StatsCards dashboard={dashboard} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 min-w-0">
          <ExpenseChart />
        </div>

        <div className="xl:col-span-1">
          <QuickActions />
        </div>
      </div>

    <RecentExpenses expenses={dashboard?.recentExpenses || []} />
    <ExpenseChart monthlyData={dashboard?.monthlyExpenses || []} />
    </div>
  );
}

export default Dashboard;
