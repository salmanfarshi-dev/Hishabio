import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCheck,
  FaCheckDouble,
  FaWallet,
  FaExchangeAlt,
  FaUsers,
  FaInfoCircle,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import API from "../../api/axios";
import { useLanguage } from "../../context/LanguageContext";

function NotificationDropdown() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const householdId = localStorage.getItem("hishabio-household-id");

  const text = {
    en: {
      notifications: "Notifications",
      markAll: "Mark all as read",
      empty: "No notifications yet",
      loading: "Loading notifications...",
      unread: "unread",
      expense_added: "New Expense",
      expense_updated: "Expense Updated",
      expense_deleted: "Expense Deleted",
      settlement: "New Settlement",
      member_joined: "New Member",
      member_removed: "Member Removed",
      reminder: "Reminder",
      general: "Notification",
    },
    bn: {
      notifications: "নোটিফিকেশন",
      markAll: "সবগুলো পড়া হয়েছে",
      empty: "এখনো কোনো নোটিফিকেশন নেই",
      loading: "লোড হচ্ছে...",
      unread: "টি অপঠিত",
      expense_added: "নতুন খরচ",
      expense_updated: "খরচ আপডেট",
      expense_deleted: "খরচ মুছে ফেলা হয়েছে",
      settlement: "নতুন লেনদেন",
      member_joined: "নতুন সদস্য",
      member_removed: "সদস্য সরানো হয়েছে",
      reminder: "রিমাইন্ডার",
      general: "নোটিফিকেশন",
    },
  };

  const t = text[language] || text.en;

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const params = householdId ? { householdId } : {};

      const response = await API.get("/notifications", { params });

      const data = response.data;

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Notification loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const params = householdId ? { householdId } : {};

      const response = await API.get("/notifications/unread-count", {
        params,
      });

      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Unread count error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchUnreadCount();

      if (isOpen) {
        fetchNotifications();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [householdId, isOpen]);

  const markAsRead = async (notificationId) => {
    try {
      await API.patch(`/notifications/${notificationId}/read`);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );

      setUnreadCount((previous) => Math.max(0, previous - 1));
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.patch("/notifications/read-all", {
        householdId,
      });

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "expense_added":
        return <FaWallet />;

      case "expense_updated":
        return <FaEdit />;

      case "expense_deleted":
        return <FaTrash />;

      case "settlement":
        return <FaExchangeAlt />;

      case "member_joined":
      case "member_removed":
        return <FaUsers />;

      default:
        return <FaInfoCircle />;
    }
  };

  const getDestination = (type) => {
    switch (type) {
      case "expense_added":
      case "expense_updated":
      case "expense_deleted":
        return "/expenses";

      case "settlement":
        return "/settlements";

      case "member_joined":
      case "member_removed":
        return "/members";

      default:
        return "/dashboard";
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    setIsOpen(false);
    navigate(getDestination(notification.type));
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString(
      language === "bn" ? "bn-BD" : "en-US",
      {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      },
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((previous) => !previous)}
        className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-background text-muted hover:text-primary transition"
        aria-label="Notifications"
      >
        <FaBell size={17} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-danger text-white text-[10px] font-bold border-2 border-surface">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <button
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
            aria-label="Close notifications"
          />

          <div className="absolute right-0 top-14 z-50 w-[min(360px,calc(100vw-32px))] bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="px-4 py-4 border-b border-border flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-heading">{t.notifications}</h3>

                {unreadCount > 0 && (
                  <p className="text-xs text-muted mt-1">
                    {unreadCount} {t.unread}
                  </p>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-70"
                >
                  <FaCheckDouble />
                  {t.markAll}
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {loading && notifications.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted">
                  {t.loading}
                </p>
              ) : notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <FaBell className="mx-auto text-3xl text-muted/40 mb-3" />

                  <p className="text-sm text-muted">{t.empty}</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left flex gap-3 p-4 border-b border-border hover:bg-background transition ${
                      !notification.isRead ? "bg-light-indigo/40" : ""
                    }`}
                  >
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-light-indigo text-primary flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-heading">
                          {notification.title ||
                            t[notification.type] ||
                            t.general}
                        </p>

                        {!notification.isRead && (
                          <span className="w-2 h-2 shrink-0 rounded-full bg-primary mt-1.5" />
                        )}
                      </div>

                      <p className="text-xs text-muted mt-1 leading-relaxed">
                        {notification.message}
                      </p>

                      <p className="text-[11px] text-muted mt-2">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="px-4 py-3 bg-background flex justify-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/dashboard");
                }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {language === "bn"
                  ? "ড্যাশবোর্ডে ফিরে যান"
                  : "Back to Dashboard"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationDropdown;
