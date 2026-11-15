import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";
import toast from "react-hot-toast";

function EditExpense() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  // Fetch Expense Details
  useEffect(() => {
    const fetchExpense = async () => {
      const householdId = localStorage.getItem("hishabio-household-id");

      if (!householdId) {
        navigate("/household-setup", { replace: true });
        return;
      }

      try {
        const response = await API.get(`/expenses?householdId=${householdId}`);

        const expenses = response.data.expenses || response.data.data || [];

        const expense = expenses.find((item) => item._id === id);

        if (!expense) {
          toast.error("Expense not found");
          navigate("/expenses", { replace: true });
          return;
        }

        setFormData({
          title: expense.title || "",
          amount: expense.amount || "",
          category: expense.category || "Others",
          date: expense.date
            ? new Date(expense.date).toISOString().split("T")[0]
            : "",
          description: expense.description || "",
        });
      } catch (error) {
        console.error("Fetch Expense Error:", error);
        toast.error(error.response?.data?.message || "Failed to load expense");
        navigate("/expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id, navigate]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Update Expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return toast.error("Please enter an expense title");
    }

    if (Number(formData.amount) <= 0) {
      return toast.error("Please enter a valid amount");
    }

    try {
      setSubmitting(true);

      await API.put(`/expenses/${id}`, {
        title: formData.title.trim(),
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description.trim(),
      });

      toast.success("Expense updated successfully!");
      navigate("/expenses");
    } catch (error) {
      console.error("Update Expense Error:", error);

      toast.error(error.response?.data?.message || "Failed to update expense");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-60">
        <p className="text-muted">Loading expense...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/expenses"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-border text-text hover:bg-surface-hover transition"
        >
          <FaArrowLeft />
        </Link>

        <div>
          <h1 className="text-2xl font-heading font-bold text-heading">
            Edit Expense
          </h1>

          <p className="text-sm text-muted mt-1">
            Update your expense information
          </p>
        </div>
      </div>

      {/* Expense Form */}
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
              <option value="Food">{t("food")}</option>
              <option value="Transport">{t("transport")}</option>
              <option value="Shopping">{t("shopping")}</option>
              <option value="Utilities">{t("utilities")}</option>
              <option value="Rent">{t("rent")}</option>
              <option value="Entertainment">{t("entertainment")}</option>
              <option value="Others">{t("others")}</option>
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

        {/* Form Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border">
          <Link
            to="/expenses"
            className="px-6 py-3 rounded-xl border border-border text-text font-semibold text-center hover:bg-surface-hover transition"
          >
            {t("cancel")}
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FaSave />
            {submitting ? "Updating..." : "Update Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditExpense;
