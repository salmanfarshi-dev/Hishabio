import { useEffect, useState } from "react";
import { FaArrowRight, FaCheckCircle, FaClock, FaPlus } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";
import toast from "react-hot-toast";

// ====================
// Household ID
// ====================

const HOUSEHOLD_ID = "6af6280f520e2fe16c73d79d";

// ====================
// Format Amount
// ====================

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-BD").format(amount || 0);

// ====================
// Format Date
// ====================

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function Settlements() {
  const { t } = useLanguage();

  const [settlements, setSettlements] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    receivedBy: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  // ====================
  // Fetch Settlements
  // ====================

  const fetchSettlements = async () => {
    try {
      const response = await API.get(
        `/settlements?householdId=${HOUSEHOLD_ID}`,
      );

      const list = response.data.settlements || response.data.data || [];

      setSettlements(list);
    } catch (error) {
      console.error("Fetch Settlements Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load settlements",
      );
    }
  };

  // ====================
  // Fetch Household Members
  // ====================

  const fetchMembers = async () => {
    try {
      const response = await API.get(`/households/${HOUSEHOLD_ID}/members`);

      const list = response.data.members || response.data.data || [];

      setMembers(list);
    } catch (error) {
      console.error("Fetch Members Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load household members",
      );
    }
  };

  // ====================
  // Initial Data Load
  // ====================

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchSettlements(), fetchMembers()]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ====================
  // Handle Input Change
  // ====================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ====================
  // Get Member Information
  // ====================

  const getMemberId = (member) => member.user?._id || member.user || member._id;

  const getMemberName = (member) =>
    member.user?.name || member.name || "Member";

  // ====================
  // Handle Settlement Submit
  // ====================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.receivedBy) {
      return toast.error("Please select a member");
    }

    if (Number(formData.amount) <= 0) {
      return toast.error("Please enter a valid amount");
    }

    try {
      setSubmitting(true);

      const settlementData = {
        household: HOUSEHOLD_ID,
        householdId: HOUSEHOLD_ID,
        receivedBy: formData.receivedBy,
        amount: Number(formData.amount),
        date: formData.date,
        note: formData.note.trim(),
      };

      await API.post("/settlements", settlementData);

      toast.success("Settlement recorded successfully!");

      setFormData({
        receivedBy: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        note: "",
      });

      setShowForm(false);

      await fetchSettlements();
    } catch (error) {
      console.error("Create Settlement Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to record settlement",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ====================
  // Settlement Summary
  // ====================

  const totalSettlements = settlements.reduce(
    (total, item) => total + Number(item.amount || 0),
    0,
  );

  const completedSettlements = settlements
    .filter((item) => item.status === "completed")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const pendingSettlements = settlements
    .filter((item) => item.status === "pending")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  // ====================
  // Render
  // ====================

  return (
    <div className="space-y-6">
      {/* ====================
          Page Header
          ==================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
            {t("settlements")}
          </h1>

          <p className="text-sm text-muted mt-2">{t("settlementSubtitle")}</p>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <FaPlus />
          {t("recordSettlement")}
        </button>
      </div>

      {/* ====================
          Record Settlement Form
          ==================== */}

      {showForm && (
        <div className="card p-5 sm:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-heading font-bold text-heading">
              Record New Settlement
            </h2>

            <p className="text-sm text-muted mt-1">
              Record a payment you have made to a household member.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Received By */}

              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Received By
                </label>

                <select
                  name="receivedBy"
                  value={formData.receivedBy}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-heading outline-none focus:border-primary transition"
                >
                  <option value="">Select Member</option>

                  {members.map((member) => {
                    const memberId = getMemberId(member);

                    return (
                      <option key={memberId} value={memberId}>
                        {getMemberName(member)}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Amount */}

              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Amount (৳)
                </label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-heading outline-none focus:border-primary transition"
                />
              </div>

              {/* Date */}

              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-heading outline-none focus:border-primary transition"
                />
              </div>

              {/* Note */}

              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Note
                </label>

                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Optional note"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-heading outline-none focus:border-primary transition"
                />
              </div>
            </div>

            {/* Form Buttons */}

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl border border-border text-text font-semibold hover:bg-surface-hover transition"
              >
                {t("cancel")}
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-60"
              >
                <FaPlus />
                {submitting ? "Saving..." : "Save Settlement"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ====================
          Settlement Summary
          ==================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="card p-5">
          <p className="text-sm text-muted">{t("totalSettlements")}</p>

          <h2 className="text-2xl font-heading font-bold text-heading mt-3">
            {loading ? "..." : `৳${formatAmount(totalSettlements)}`}
          </h2>
        </div>

        <div className="card p-5">
          <p className="text-sm text-muted">{t("completedSettlements")}</p>

          <h2 className="text-2xl font-heading font-bold text-success mt-3">
            {loading ? "..." : `৳${formatAmount(completedSettlements)}`}
          </h2>
        </div>

        <div className="card p-5">
          <p className="text-sm text-muted">{t("pendingSettlements")}</p>

          <h2 className="text-2xl font-heading font-bold text-warning mt-3">
            {loading ? "..." : `৳${formatAmount(pendingSettlements)}`}
          </h2>
        </div>
      </div>

      {/* ====================
          Settlement History
          ==================== */}

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-heading font-bold text-heading">
            {t("settlementHistory")}
          </h2>

          <p className="text-sm text-muted mt-1">
            {t("settlementHistoryDescription")}
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted">
            Loading settlements...
          </div>
        ) : settlements.length > 0 ? (
          <div className="divide-y divide-border">
            {settlements.map((item) => {
              const isCompleted = item.status === "completed";

              const fromName = item.paidBy?.name || item.paidByName || "Member";

              const toName =
                item.receivedBy?.name || item.receivedByName || "Member";

              return (
                <div
                  key={item._id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-hover transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-light-indigo flex items-center justify-center text-primary">
                      <FaArrowRight />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-heading">
                          {fromName}
                        </span>

                        <FaArrowRight className="text-muted text-xs" />

                        <span className="font-semibold text-heading">
                          {toName}
                        </span>
                      </div>

                      <p className="text-xs text-muted mt-1">
                        {formatDate(item.date)}
                      </p>

                      {item.note && (
                        <p className="text-xs text-muted mt-1">{item.note}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <h3 className="font-heading font-bold text-heading">
                      ৳{formatAmount(item.amount)}
                    </h3>

                    <span
                      className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full ${
                        isCompleted
                          ? "bg-light-indigo text-success"
                          : "bg-surface-hover text-warning"
                      }`}
                    >
                      {isCompleted ? <FaCheckCircle /> : <FaClock />}

                      {isCompleted ? t("completed") : t("pending")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-muted">
            No settlements found.
          </div>
        )}
      </div>

      {/* ====================
          Balance Link
          ==================== */}

      <div className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-heading">
            {t("checkYourBalances")}
          </h3>

          <p className="text-sm text-muted mt-1">{t("balanceDescription")}</p>
        </div>

        <a href="/balances" className="btn-primary">
          {t("viewBalances")}
          <FaArrowRight />
        </a>
      </div>
    </div>
  );
}

export default Settlements;
