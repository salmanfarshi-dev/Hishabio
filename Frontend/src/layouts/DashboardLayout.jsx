import { useEffect, useState } from "react";
import { FaBars, FaGlobe } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import Sidebar from "../components/dashboard/Sidebar";
import NotificationDropdown from "../components/dashboard/NotificationDropdown";
import { Link, Outlet } from "react-router-dom";
import API from "../api/axios";

function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    profileImage: "",
  });

  const [householdRole, setHouseholdRole] = useState("");

  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await API.get("/auth/me");

        const currentUser =
          response.data.user || response.data.data || response.data;

        setUser({
          name: currentUser.name || "",
          email: currentUser.email || "",
          profileImage: currentUser.profileImage || "",
        });

        const householdId = localStorage.getItem("hishabio-household-id");

        if (!householdId) return;

        const membersResponse = await API.get(
          `/households/${householdId}/members`,
        );

        const members = membersResponse.data.members || [];

        const currentMember = members.find(
          (member) =>
            member.user?.email?.toLowerCase() ===
            currentUser.email?.toLowerCase(),
        );

        setHouseholdRole(currentMember?.role || "");
      } catch (error) {
        console.error("User information loading error:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const initials = user.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <main className="min-h-screen lg:ml-[260px]">
        <header className="h-20 bg-surface border-b border-border px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden text-heading text-xl"
            >
              <FaBars />
            </button>

            <div>
              <h2 className="text-lg sm:text-xl font-heading font-bold text-heading">
                Hishabio
              </h2>

              <p className="hidden sm:block text-xs text-muted">
                {t("overview")}
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Language Toggle - Desktop Only */}
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-semibold text-heading hover:bg-light-indigo hover:text-primary transition"
            >
              <FaGlobe />
              {language === "en" ? "বাংলা" : "English"}
            </button>

            {/* Notifications */}
            <NotificationDropdown />

            {/* Profile - Mobile & Desktop */}
            <Link
              to="/profile"
              className="flex items-center gap-3 sm:pl-3 sm:border-l sm:border-border"
              title="My Profile"
            >
              <div className="w-10 h-10 rounded-full bg-light-indigo text-primary flex items-center justify-center font-bold overflow-hidden shrink-0">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              {/* User Information - Desktop Only */}
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-heading">
                  {user.name || "User"}
                </p>

                <p className="text-xs text-muted capitalize">{householdRole}</p>
              </div>
            </Link>
          </div>
        </header>

        <section className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;
