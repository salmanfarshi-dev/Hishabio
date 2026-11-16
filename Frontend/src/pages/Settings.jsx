import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaGlobe,
  FaBell,
  FaLock,
  FaUserCog,
  FaSave,
  FaCoins,
  FaSignOutAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaSun,
  FaMoon,
  FaDesktop,
} from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const defaultNotifications = {
  expense: true,
  settlement: true,
  invitation: false,
  email: true,
};

const currencies = [
  { value: "BDT", label: "BDT — Bangladeshi Taka (৳)" },
  { value: "USD", label: "USD — US Dollar ($)" },
  { value: "EUR", label: "EUR — Euro (€)" },
  { value: "GBP", label: "GBP — British Pound (£)" },
];

function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(defaultNotifications);
  const [currency, setCurrency] = useState("BDT");
  const [saving, setSaving] = useState(false);

  // Load Settings
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem("hishabio-notifications");

      const savedCurrency = localStorage.getItem("hishabio-currency");

      if (savedNotifications) {
        setNotifications({
          ...defaultNotifications,
          ...JSON.parse(savedNotifications),
        });
      }

      if (savedCurrency) {
        setCurrency(savedCurrency);
      }
    } catch (error) {
      console.error("Settings loading error:", error);
    }
  }, []);

  // Notification Toggle
  const handleNotification = (name) => {
    setNotifications((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  // Save Settings
  const handleSaveSettings = () => {
    try {
      setSaving(true);

      localStorage.setItem(
        "hishabio-notifications",
        JSON.stringify(notifications),
      );

      localStorage.setItem("hishabio-currency", currency);

      toast.success(
        language === "bn"
          ? "Settings সফলভাবে সংরক্ষণ হয়েছে!"
          : "Settings saved successfully!",
      );
    } catch (error) {
      console.error("Settings save error:", error);
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // Logout
  const handleLogout = () => {
    const confirmed = window.confirm(
      language === "bn"
        ? "আপনি কি নিশ্চিতভাবে Logout করতে চান?"
        : "Are you sure you want to logout?",
    );

    if (!confirmed) return;

    localStorage.removeItem("hishabio-token");
    sessionStorage.removeItem("hishabio-token");

    toast.success(
      language === "bn" ? "সফলভাবে Logout হয়েছে" : "Logged out successfully",
    );

    navigate("/login", { replace: true });
  };

  // Notification Options
  const notificationOptions = [
    {
      key: "expense",
      title: t("expenseNotifications"),
      description: t("expenseNotificationsDescription"),
    },
    {
      key: "settlement",
      title: t("settlementNotifications"),
      description: t("settlementNotificationsDescription"),
    },
    {
      key: "invitation",
      title: t("invitationNotifications"),
      description: t("invitationNotificationsDescription"),
    },
    {
      key: "email",
      title: t("emailNotifications"),
      description: t("emailNotificationsDescription"),
    },
  ];

  const themeOptions = [
    {
      value: "light",
      label: language === "bn" ? "লাইট মোড" : "Light Mode",
      description:
        language === "bn"
          ? "উজ্জ্বল ও পরিষ্কার ডিজাইন"
          : "Bright and clean appearance",
      icon: FaSun,
    },
    {
      value: "dark",
      label: language === "bn" ? "ডার্ক মোড" : "Dark Mode",
      description:
        language === "bn"
          ? "চোখের জন্য আরামদায়ক ডার্ক ডিজাইন"
          : "Comfortable dark appearance",
      icon: FaMoon,
    },
    {
      value: "system",
      label: language === "bn" ? "সিস্টেম ডিফল্ট" : "System Default",
      description:
        language === "bn"
          ? "ডিভাইসের Theme অনুসরণ করবে"
          : "Follows your device appearance",
      icon: FaDesktop,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
          {t("settings")}
        </h1>

        <p className="text-sm text-muted mt-2">{t("settingsSubtitle")}</p>
      </div>

      {/* General Settings */}
      <div className="card p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-light-indigo flex items-center justify-center text-primary">
            <FaUserCog />
          </div>

          <div>
            <h2 className="font-heading font-bold text-heading">
              {t("generalSettings")}
            </h2>

            <p className="text-sm text-muted">
              {t("generalSettingsDescription")}
            </p>
          </div>
        </div>

        {/* Language */}
        <div className="border-t border-border pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FaGlobe className="text-primary" />

              <div>
                <p className="font-semibold text-heading">{t("language")}</p>

                <p className="text-xs text-muted">{t("languageDescription")}</p>
              </div>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border bg-surface text-heading outline-none focus:border-primary"
            >
              <option value="en">English</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>
        </div>

        {/* Theme */}
        <div className="border-t border-border pt-5">
          <div className="flex items-center gap-3 mb-4">
            <FaMoon className="text-primary" />

            <div>
              <p className="font-semibold text-heading">
                {language === "bn" ? "থিম সেটিংস" : "Appearance & Theme"}
              </p>

              <p className="text-xs text-muted">
                {language === "bn"
                  ? "তোমার পছন্দের ডিজাইন নির্বাচন করো"
                  : "Choose your preferred appearance"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themeOptions.map((item) => {
              const Icon = item.icon;
              const isActive = theme === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTheme(item.value)}
                  aria-pressed={isActive}
                  className={`relative flex flex-col items-center text-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    isActive
                      ? "border-primary bg-light-indigo"
                      : "border-border bg-surface hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-surface-hover text-muted"
                    }`}
                  >
                    <Icon />
                  </div>

                  <div>
                    <p className="font-semibold text-heading text-sm">
                      {item.label}
                    </p>

                    <p className="text-xs text-muted mt-1">
                      {item.description}
                    </p>
                  </div>

                  {isActive && (
                    <FaCheckCircle className="absolute top-3 right-3 text-primary" />
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted mt-3">
            {language === "bn"
              ? "Theme পরিবর্তন করলে সঙ্গে সঙ্গে কার্যকর হবে।"
              : "Your theme preference is applied immediately."}
          </p>
        </div>

        {/* Currency */}
        <div className="border-t border-border pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FaCoins className="text-primary" />

              <div>
                <p className="font-semibold text-heading">
                  Currency Preference
                </p>

                <p className="text-xs text-muted">
                  Choose your preferred display currency
                </p>
              </div>
            </div>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border bg-surface text-heading outline-none focus:border-primary"
            >
              {currencies.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-muted mt-3">
            This preference is saved locally. It does not convert existing
            expense amounts or exchange rates.
          </p>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-light-indigo flex items-center justify-center text-primary">
            <FaBell />
          </div>

          <div>
            <h2 className="font-heading font-bold text-heading">
              {t("notificationSettings")}
            </h2>

            <p className="text-sm text-muted">{t("notificationDescription")}</p>
          </div>
        </div>

        <div className="border-t border-border pt-5 space-y-5">
          {notificationOptions.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-heading">{item.title}</p>

                <p className="text-xs text-muted mt-1">{item.description}</p>
              </div>

              <button
                type="button"
                role="switch"
                aria-label={item.title}
                aria-checked={notifications[item.key]}
                onClick={() => handleNotification(item.key)}
                className={`relative w-12 h-6 rounded-full transition shrink-0 ${
                  notifications[item.key] ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    notifications[item.key] ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-light-indigo flex items-center justify-center text-primary">
            <FaLock />
          </div>

          <div>
            <h2 className="font-heading font-bold text-heading">
              {t("securitySettings")}
            </h2>

            <p className="text-sm text-muted">{t("securityDescription")}</p>
          </div>
        </div>

        <div className="border-t border-border mt-5 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <FaShieldAlt className="text-success mt-1" />

            <div>
              <p className="font-semibold text-heading">
                {t("changePassword")}
              </p>

              <p className="text-xs text-muted mt-1">
                {t("changePasswordDescription")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="px-5 py-2.5 rounded-xl border border-border text-heading font-semibold hover:border-primary hover:text-primary transition"
          >
            Reset Password
          </button>
        </div>
      </div>

      {/* Save Settings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted">
          <FaCheckCircle className="text-success" />
          Your preferences are stored on this device.
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={saving}
          className="btn-primary disabled:opacity-60"
        >
          <FaSave />

          {saving ? "Saving..." : t("saveSettings")}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="card p-5 sm:p-6 border border-red-200 dark:border-red-900">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 flex items-center justify-center">
            <FaSignOutAlt />
          </div>

          <div>
            <h2 className="font-heading font-bold text-heading">Danger Zone</h2>

            <p className="text-sm text-muted">
              Sign out from your current account
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-5 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-heading">Logout</p>

            <p className="text-xs text-muted mt-1">
              You will need to login again to access your household.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 font-semibold hover:bg-red-100 dark:hover:bg-red-900 transition"
          >
            <span className="flex items-center gap-2">
              <FaSignOutAlt />
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
