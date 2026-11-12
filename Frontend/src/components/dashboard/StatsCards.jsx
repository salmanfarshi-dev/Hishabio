import {
  FaWallet,
  FaChartPie,
  FaMoneyBillWave,
  FaBalanceScale,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

function StatsCards() {
  const { t } = useLanguage();

  const stats = [
    {
      title: t("totalExpenses"),
      amount: "৳12,500",
      description: "This month's total",
      icon: FaWallet,
      iconBg: "bg-light-indigo",
      iconColor: "text-primary",
      trend: "+12.5%",
      trendType: "up",
    },
    {
      title: t("yourShare"),
      amount: "৳3,125",
      description: "Your share of expenses",
      icon: FaChartPie,
      iconBg: "bg-blue-50",
      iconColor: "text-info",
      trend: "25%",
      trendType: "neutral",
    },
    {
      title: t("youPaid"),
      amount: "৳5,000",
      description: "Total amount you paid",
      icon: FaMoneyBillWave,
      iconBg: "bg-green-50",
      iconColor: "text-success",
      trend: "+8.2%",
      trendType: "up",
    },
    {
      title: t("yourBalance"),
      amount: "৳1,875",
      description: "You will receive",
      icon: FaBalanceScale,
      iconBg: "bg-purple-50",
      iconColor: "text-secondary",
      trend: "Positive",
      trendType: "up",
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

              <span
                className={`flex items-center gap-1 text-xs font-bold ${
                  item.trendType === "up" ? "text-success" : "text-info"
                }`}
              >
                {item.trendType === "up" && <FaArrowUp size={10} />}
                {item.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;
