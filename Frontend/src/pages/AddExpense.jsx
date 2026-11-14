import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";
import toast from "react-hot-toast";

// ====================
// Household ID
// ====================

const HOUSEHOLD_ID = "6af6280f520e2fe16c73d79d";

// ====================
// Get Local Date
// ====================

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function AddExpense() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    paidBy: "",
    date: getToday(),
    description: "",
  });

  // ====================
  // Fetch Household Members
  // ====================

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await API.get(`/households/${HOUSEHOLD_ID}/members`);

        const memberList = response.data.members || response.data.data || [];

        setMembers(memberList);

        // Default payer: first household member
        if (memberList.length > 0) {
          const firstMember = memberList[0];
          const firstMemberId =
            firstMember.user?._id || firstMember.user || firstMember._id;

          setFormData((previous) => ({
            ...previous,
            paidBy: firstMemberId,
          }));
        }
      } catch (error) {
        console.error("Fetch Members Error:", error);

        toast.error(
          error.response?.data?.message || "Failed to load household members",
        );
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
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
  // Handle Form Submit
  // ====================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return toast.error("Please enter an expense title");
    }

    if (Number(formData.amount) <= 0) {
      return toast.error("Please enter a valid amount");
    }

    if (!formData.paidBy) {
      return toast.error("Please select who paid");
    }

    if (members.length === 0) {
      return toast.error("No household members found");
    }

    try {
      setSubmitting(true);

      const participants = members.map((member) => {
        const userId = member.user?._id || member.user || member._id;

        return {
          user: userId,
        };
      });

      const expenseData = {
        household: HOUSEHOLD_ID,
        householdId: HOUSEHOLD_ID,
        title: formData.title.trim(),
        amount: Number(formData.amount),
        category: formData.category,
        paidBy: formData.paidBy,
        splitType: "equal",
        participants,
        date: formData.date,
        description: formData.description.trim(),
      };

      await API.post("/expenses", expenseData);

      toast.success("Expense added successfully!");
      navigate("/expenses");
    } catch (error) {
      console.error("Add Expense Error:", error);

      toast.error(error.response?.data?.message || "Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ====================
          Page Header
          ==================== */}

      <div className="flex items-center gap-4">
        <Link
          to="/expenses"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-border text-text hover:bg-surface-hover transition"
        >
          <FaArrowLeft />
        </Link>

        <div>
          <h1 className="text-2xl font-heading font-bold text-heading">
            {t("addExpense")}
          </h1>

          <p className="text-sm text-muted mt-1">
            {t("addExpenseDescription")}
          </p>
        </div>
      </div>

      {/* ====================
          Expense Form
          ==================== */}

      <form onSubmit={handleSubmit} className="card p-5 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Expense Title */}

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-heading mb-2">
              {t("expenseTitle")}
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t("enterExpenseTitle")}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-heading outline-none focus:border-primary transition"
            />
          </div>

          {/* Amount */}

          <div>
            <label className="block text-sm font-semibold text-heading mb-2">
              {t("amount")} (৳)
            </label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="1"
              step="0.01"
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-heading outline-none focus:border-primary transition"
            />
          </div>

          {/* Category */}

          <div>
            <label className="block text-sm font-semibold text-heading mb-2">
              {t("category")}
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-heading outline-none focus:border-primary transition"
            >
              <option value="">{t("selectCategory")}</option>
              <option value="food">{t("food")}</option>
              <option value="transport">{t("transport")}</option>
              <option value="shopping">{t("shopping")}</option>
              <option value="utilities">{t("utilities")}</option>
              <option value="others">{t("others")}</option>
            </select>
          </div>

          {/* Paid By */}

          <div>
            <label className="block text-sm font-semibold text-heading mb-2">
              {t("paidBy")}
            </label>

            <select
              name="paidBy"
              value={formData.paidBy}
              onChange={handleChange}
              required
              disabled={loadingMembers || members.length === 0}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-heading outline-none focus:border-primary transition disabled:opacity-60"
            >
              <option value="">
                {loadingMembers ? "Loading members..." : t("selectMember")}
              </option>

              {members.map((member) => {
                const user = member.user;
                const memberId = user?._id || user || member._id;
                const memberName = user?.name || member.name || "Member";

                return (
                  <option key={memberId} value={memberId}>
                    {memberName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Date */}

          <div>
            <label className="block text-sm font-semibold text-heading mb-2">
              {t("date")}
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

          {/* Description */}

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-heading mb-2">
              {t("description")}
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t("enterDescription")}
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-heading outline-none focus:border-primary transition resize-none"
            />
          </div>
        </div>

        {/* ====================
            Split Information
            ==================== */}

        <div className="rounded-xl bg-light-indigo p-4">
          <p className="text-sm font-semibold text-primary">Equal Split</p>

          <p className="text-sm text-text mt-1">
            This expense will be divided equally among all {members.length}{" "}
            household members.
          </p>
        </div>

        {/* ====================
            Form Buttons
            ==================== */}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border">
          <Link
            to="/expenses"
            className="px-6 py-3 rounded-xl border border-border text-text font-semibold text-center hover:bg-surface-hover transition"
          >
            {t("cancel")}
          </Link>

          <button
            type="submit"
            disabled={submitting || loadingMembers || members.length === 0}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FaPlus />
            {submitting ? "Saving..." : t("saveExpense")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddExpense;
