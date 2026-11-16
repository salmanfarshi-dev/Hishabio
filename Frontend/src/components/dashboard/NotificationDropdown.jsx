import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCheckDouble,
  FaWallet,
  FaExchangeAlt,
  FaUsers,
  FaInfoCircle,
  FaTrash,
  FaEdit,
  FaArrowRight,
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
      empty: "You're all caught up!",
      emptySub: "New updates will appear here.",
      loading: "Loading notifications...",
      unread: "unread",
      back: "Back to Dashboard",
      today: "Stay updated with your household",
      expense_added: "New Expense",
      expense_updated: "Expense Updated",
      expense_deleted: "Expense Deleted",
      settlement: "New Settlement",
      member_joined: "New Member Joined",
      member_removed: "Member Removed",
      reminder: "Reminder",
      general: "Notification",
      added: "was added",
      updated: "was updated",
      deleted: "was deleted",
      addedBy: "Added by",
      updatedBy: "Updated by",
      deletedBy: "Deleted by",
      recordedBy: "Recorded by",
      joined: "joined",
      joinedBy: "Joined by",
      removed: "was removed from",
      removedBy: "Removed by",
      payment: "A payment of",
      sentTo: "was sent to",
      newMember: "A new member joined",
    },
    bn: {
      notifications: "নোটিফিকেশন",
      markAll: "সব পড়া হয়েছে",
      empty: "সব নোটিফিকেশন দেখা হয়েছে!",
      emptySub: "নতুন আপডেট এখানে দেখা যাবে।",
      loading: "নোটিফিকেশন লোড হচ্ছে...",
      unread: "টি অপঠিত",
      back: "ড্যাশবোর্ডে ফিরে যান",
      today: "আপনার পরিবারের আপডেট দেখুন",
      expense_added: "নতুন খরচ",
      expense_updated: "খরচ আপডেট",
      expense_deleted: "খরচ মুছে ফেলা হয়েছে",
      settlement: "নতুন লেনদেন",
      member_joined: "নতুন সদস্য যোগ হয়েছে",
      member_removed: "সদস্য সরানো হয়েছে",
      reminder: "রিমাইন্ডার",
      general: "নোটিফিকেশন",
      added: "যোগ করা হয়েছে",
      updated: "আপডেট করা হয়েছে",
      deleted: "মুছে ফেলা হয়েছে",
      addedBy: "যোগ করেছেন",
      updatedBy: "আপডেট করেছেন",
      deletedBy: "মুছে দিয়েছেন",
      recordedBy: "রেকর্ড করেছেন",
      joined: "যোগ দিয়েছেন",
      joinedBy: "যোগ দিয়েছেন",
      removed: "থেকে সরানো হয়েছে",
      removedBy: "সরিয়েছেন",
      payment: "৳ টাকার একটি পেমেন্ট",
      sentTo: "পাঠানো হয়েছে",
      newMember: "নতুন সদস্য যোগ দিয়েছেন",
    },
  };

  const t = text[language] || text.en;

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const params = householdId ? { householdId } : {};
      const response = await API.get("/notifications", { params });

      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
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
      await API.patch("/notifications/read-all", { householdId });

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

  // Translate messages created by the backend
  const getTranslatedMessage = (notification) => {
    const message = notification.message || "";
    const type = notification.type;

    if (language !== "bn") return message;

    let match;

    if (type === "expense_added") {
      match = message.match(
        /^(.*?) expense of (.*?) was added\.\s*Added by:\s*(.*)$/,
      );
      if (match) {
        return `${match[1]} খরচ (${match[2]}) ${t.added}। ${t.addedBy}: ${match[3]}`;
      }
    }

    if (type === "expense_updated") {
      match = message.match(
        /^(.*?) expense was updated\.\s*Updated by:\s*(.*)$/,
      );
      if (match) {
        return `${match[1]} খরচ ${t.updated}। ${t.updatedBy}: ${match[2]}`;
      }
    }

    if (type === "expense_deleted") {
      match = message.match(
        /^(.*?) expense was deleted\.\s*Deleted by:\s*(.*)$/,
      );
      if (match) {
        return `${match[1]} খরচ ${t.deleted}। ${t.deletedBy}: ${match[2]}`;
      }
    }

    if (type === "settlement") {
      match = message.match(
        /^A payment of (.*?) was sent to (.*?)\.\s*Recorded by:\s*(.*)$/,
      );
      if (match) {
        return `${match[1]} ${t.sentTo} ${match[2]}। ${t.recordedBy}: ${match[3]}`;
      }
    }

    if (type === "member_joined") {
      match = message.match(/^A new member joined (.*?)\.\s*Joined:\s*(.*)$/);
      if (match) {
        return `${match[2]} ${t.joined} ${match[1]}-এ।`;
      }
    }

    if (type === "member_removed") {
      match = message.match(
        /^(.*?) was removed from (.*?)\.\s*Removed by:\s*(.*)$/,
      );
      if (match) {
        return `${match[1]}-কে ${match[2]} থেকে ${t.removed}। ${t.removedBy}: ${match[3]}`;
      }
    }

    return message;
  };

  const getTitle = (notification) => {
    return t[notification.type] || notification.title || t.general;
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
        className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-background text-muted hover:text-primary hover:bg-light-indigo/40 transition"
        aria-label={t.notifications}
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

          <div className="absolute right-0 top-14 z-50 w-[min(380px,calc(100vw-32px))] bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Header */}
            <div className="px-4 py-4 border-b border-border bg-gradient-to-r from-light-indigo/50 to-transparent">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-light-indigo text-primary flex items-center justify-center">
                    <FaBell size={17} />
                  </div>

                  <div>
                    <h3 className="font-bold text-heading">
                      {t.notifications}
                    </h3>
                    <p className="text-[11px] text-muted mt-0.5">{t.today}</p>
                  </div>
                </div>

                {unreadCount > 0 && (
                  <span className="text-xs font-semibold text-primary bg-light-indigo px-2.5 py-1 rounded-full">
                    {unreadCount} {t.unread}
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary hover:opacity-70 transition"
                >
                  <FaCheckDouble />
                  {t.markAll}
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-[420px] overflow-y-auto">
              {loading && notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-muted">{t.loading}</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-12 px-5 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center mx-auto mb-3 text-muted/50">
                    <FaBell size={24} />
                  </div>
                  <p className="text-sm font-semibold text-heading">
                    {t.empty}
                  </p>
                  <p className="text-xs text-muted mt-1">{t.emptySub}</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left flex gap-3 p-4 border-b border-border hover:bg-background transition ${
                      !notification.isRead ? "bg-light-indigo/30" : ""
                    }`}
                  >
                    <div className="relative w-10 h-10 shrink-0 rounded-xl bg-light-indigo text-primary flex items-center justify-center">
                      {getIcon(notification.type)}
                      {!notification.isRead && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-heading">
                          {getTitle(notification)}
                        </p>
                      </div>

                      <p className="text-xs text-muted mt-1 leading-relaxed break-words">
                        {getTranslatedMessage(notification)}
                      </p>

                      <p className="text-[11px] text-muted/80 mt-2">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-background flex justify-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/dashboard");
                }}
                className="flex items-center gap-2 text-xs font-semibold text-primary hover:gap-3 transition-all"
              >
                {t.back}
                <FaArrowRight size={10} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationDropdown;
