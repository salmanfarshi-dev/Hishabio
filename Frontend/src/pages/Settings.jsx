import { useState } from "react";
import { FaGlobe, FaBell, FaLock, FaUserCog, FaSave } from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";

function Settings() {
  const { language, setLanguage, t } = useLanguage();

  const [notifications, setNotifications] = useState({
    expense: true,
    settlement: true,
    invitation: false,
    email: true,
  });

  /* ====================
     Handle Notification
     ==================== */

  const handleNotification = (name) => {
    setNotifications((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  return (
    <div className="space-y-6">
      {/* ====================
          Page Header
          ==================== */}

      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
          {t("settings")}
        </h1>

        <p className="text-sm text-muted mt-2">{t("settingsSubtitle")}</p>
      </div>

      {/* ====================
          General Settings
          ==================== */}

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
      </div>

      {/* ====================
          Notification Settings
          ==================== */}

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

        <div className="border-t border-border pt-2 space-y-5">
          {[
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
          ].map((item) => (
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
                aria-checked={notifications[item.key]}
                onClick={() => handleNotification(item.key)}
                className={`relative w-12 h-6 rounded-full transition shrink-0 ${
                  notifications[item.key] ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-surface transition-all ${
                    notifications[item.key] ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ====================
          Security Settings
          ==================== */}

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
          <div>
            <p className="font-semibold text-heading">{t("changePassword")}</p>

            <p className="text-xs text-muted mt-1">
              {t("changePasswordDescription")}
            </p>
          </div>

          <button
            type="button"
            disabled
            className="px-5 py-2.5 rounded-xl border border-border text-muted font-semibold cursor-not-allowed"
          >
            {t("comingSoon")}
          </button>
        </div>
      </div>

      {/* ====================
          Save Settings
          ==================== */}

      <div className="flex justify-end">
        <button
          type="button"
          disabled
          className="btn-primary opacity-60 cursor-not-allowed"
        >
          <FaSave />
          {t("saveSettings")}
        </button>
      </div>
    </div>
  );
}

export default Settings;
