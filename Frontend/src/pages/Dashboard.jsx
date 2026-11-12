import { useState } from "react";
import { FaBars, FaBell, FaGlobe } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import Sidebar from "../components/dashboard/Sidebar";
import StatsCards from "../components/dashboard/StatsCards";
import RecentExpenses from "../components/dashboard/RecentExpenses";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import QuickActions from "../components/dashboard/QuickActions";
function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* ====================
          Dashboard Sidebar
          ==================== */}

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* ====================
          Main Content
          ==================== */}

      <main className="min-h-screen lg:ml-[260px]">
        {/* ====================
            Top Header
            ==================== */}

        <header className="h-20 bg-surface border-b border-border px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden text-heading text-xl"
            >
              <FaBars />
            </button>

            <div>
              <h2 className="text-lg sm:text-xl font-heading font-bold text-heading">
                {t("dashboard")}
              </h2>

              <p className="hidden sm:block text-xs text-muted">
                {t("overview")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* ====================
                Language Switcher
                ==================== */}

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-semibold text-heading hover:bg-light-indigo hover:text-primary transition"
            >
              <FaGlobe />
              {language === "en" ? "বাংলা" : "English"}
            </button>

            {/* ====================
                Notification Button
                ==================== */}

            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-background text-muted hover:text-primary transition">
              <FaBell size={17} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger border-2 border-surface" />
            </button>

            {/* ====================
                User Profile
                ==================== */}

            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
              <div className="w-10 h-10 rounded-full bg-light-indigo text-primary flex items-center justify-center font-bold">
                SF
              </div>

              <div>
                <p className="text-sm font-bold text-heading">Salman Farshi</p>
                <p className="text-xs text-muted">Member</p>
              </div>
            </div>
          </div>
        </header>

        {/* ====================
            Dashboard Content
            ==================== */}

        <section className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-heading mb-2">
              {t("welcome")}
            </h1>

            <p className="text-muted">{t("dashboardSubtitle")}</p>
          </div>

          {/* ====================
              Dashboard Placeholder
              ==================== */}

          {/* ====================
    Summary Cards
    ==================== */}

          <StatsCards />

          {/* ====================
    Recent Expenses
    ==================== */}

          <div className="mt-6">
            <RecentExpenses />
          </div>

          {/* ====================
    Monthly Expense Chart
    ==================== */}

          <div className="mt-6">
            <ExpenseChart />
          </div>

          {/* ====================
    Quick Actions
    ==================== */}

          <div className="mt-6">
            <QuickActions />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
