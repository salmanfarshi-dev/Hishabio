import { NavLink, Link ,useNavigate} from "react-router-dom";
import {
  FaThLarge,
  FaWallet,
  FaBalanceScale,
  FaExchangeAlt,
  FaUsers,
  FaChartPie,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
function Sidebar({ isOpen, setIsOpen }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("hishabio-demo-auth");
  navigate("/login");
};

  const navItems = [
    { name: t("dashboard"), path: "/dashboard", icon: FaThLarge },
    { name: t("expenses"), path: "/expenses", icon: FaWallet },
    { name: t("balances"), path: "/balances", icon: FaBalanceScale },
    { name: t("settlements"), path: "/settlements", icon: FaExchangeAlt },
    { name: t("members"), path: "/members", icon: FaUsers },
    { name: t("reports"), path: "/reports", icon: FaChartPie },
    { name: t("settings"), path: "/settings", icon: FaCog },
  ];

  return (
    <>
      {/* ====================
          Mobile Overlay
          ==================== */}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-heading/40 z-40 lg:hidden"
        />
      )}

      {/* ====================
          Sidebar
          ==================== */}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-[260px] bg-surface border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ====================
            Brand Logo
            ==================== */}

        <div className="h-20 px-6 flex items-center justify-between border-b border-border">
          <Link to="/dashboard">
            <h1 className="text-2xl font-heading font-extrabold text-primary">
              Hishabio.
            </h1>
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-muted hover:text-danger"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* ====================
            Navigation Links
            ==================== */}

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-3 mb-4 text-xs font-bold uppercase tracking-wider text-muted">
            {t("overview")}
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
                    isActive
                      ? "bg-light-indigo text-primary"
                      : "text-text hover:bg-surface-hover"
                  }`
                }
              >
                <Icon size={17} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* ====================
            Logout Button
            ==================== */}

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger font-semibold text-sm hover:bg-red-50 transition"
          >
            <FaSignOutAlt size={17} />
            {t("logout")}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
