import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";

import StatsCards from "../components/dashboard/StatsCards";
import RecentExpenses from "../components/dashboard/RecentExpenses";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import QuickActions from "../components/dashboard/QuickActions";

function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ====================
  // Fetch Dashboard Data
  // ====================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // Step 1: Get all households of logged-in user
        const householdResponse = await API.get("/households/my-households");

        const households = householdResponse.data.households || [];

        // Step 2: If user has no household, go to setup
        if (households.length === 0) {
          localStorage.removeItem("hishabio-household-id");
          navigate("/household-setup", { replace: true });
          return;
        }

        // Step 3: Select saved household if valid
        const savedHouseholdId = localStorage.getItem("hishabio-household-id");

        const activeHousehold =
          households.find((item) => item._id === savedHouseholdId) ||
          households[0];

        // Step 4: Save valid household ID
        const householdId = activeHousehold._id;

        localStorage.setItem("hishabio-household-id", householdId);

        // Step 5: Fetch dashboard data
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
  }, [navigate]);

  // ====================
  // Loading State
  // ====================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ====================
  // Error State
  // ====================

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

        <button
          onClick={() => navigate("/household-setup")}
          className="mt-4 ml-3 px-5 py-2 border border-border text-heading rounded-lg"
        >
          Change Household
        </button>
      </div>
    );
  }

  // ====================
  // Dashboard UI
  // ====================

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
          {dashboard?.householdName}
        </div>
      </div>

      {/* ====================
          Stats Cards
          ==================== */}

      <StatsCards dashboard={dashboard} />

      {/* ====================
          Chart & Quick Actions
          ==================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 min-w-0">
          <ExpenseChart monthlyData={dashboard?.monthlyExpenses || []} />
        </div>

        <div className="xl:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* ====================
          Recent Expenses
          ==================== */}

      <RecentExpenses expenses={dashboard?.recentExpenses || []} />
    </div>
  );
}

export default Dashboard;
