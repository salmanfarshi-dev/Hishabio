import {
  FaWallet,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUsers,
} from "react-icons/fa";

import { useLanguage } from "../../context/LanguageContext";

function StatsCards({ dashboard }) {
  const { t } = useLanguage();

  // Currency formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const stats = [
    {
      title: t("totalExpenses"),
      amount: formatCurrency(dashboard?.totalSpent),
      description: "Total household spending",
      icon: FaWallet,
      iconBg: "bg-light-indigo",
      iconColor: "text-primary",
    },
    {
      title: t("thisMonth"),
      amount: formatCurrency(dashboard?.monthlySpent),
      description: "Current month's spending",
      icon: FaCalendarAlt,
      iconBg: "bg-blue-50",
      iconColor: "text-info",
    },
    {
      title: t("totalSettled"),
      amount: formatCurrency(dashboard?.totalSettled),
      description: `${dashboard?.totalSettlements || 0} settlements recorded`,
      icon: FaMoneyBillWave,
      iconBg: "bg-green-50",
      iconColor: "text-success",
    },
    {
      title: t("totalMembers"),
      amount: dashboard?.totalMembers || 0,
      description: "Members in your household",
      icon: FaUsers,
      iconBg: "bg-purple-50",
      iconColor: "text-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="card p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* ====================
                Card Header
                ==================== */}

            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-medium text-muted mb-2">
                  {item.title}
                </p>

                <h3 className="text-2xl font-heading font-bold text-heading">
                  {item.amount}
                </h3>
              </div>

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.iconBg} ${item.iconColor}`}
              >
                <Icon size={21} />
              </div>
            </div>

            {/* ====================
                Card Footer
                ==================== */}

            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-muted">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;
