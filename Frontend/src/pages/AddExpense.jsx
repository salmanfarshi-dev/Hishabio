import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

function AddExpense() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    paidBy: "",
    date: "",
    description: "",
  });

  /* ====================
     Handle Input Change
     ==================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ====================
     Handle Form Submit
     ==================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("New Expense:", formData);

    navigate("/expenses");
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
              <option value="Food">{t("food")}</option>
              <option value="Transport">{t("transport")}</option>
              <option value="Shopping">{t("shopping")}</option>
              <option value="Utilities">{t("utilities")}</option>
              <option value="Others">{t("others")}</option>
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
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-heading outline-none focus:border-primary transition"
            >
              <option value="">{t("selectMember")}</option>
              <option value="Salman Farshi">Salman Farshi</option>
              <option value="Rahim">Rahim</option>
              <option value="Karim">Karim</option>
              <option value="Hasan">Hasan</option>
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
            Form Buttons
            ==================== */}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border">
          <Link
            to="/expenses"
            className="px-6 py-3 rounded-xl border border-border text-text font-semibold text-center hover:bg-surface-hover transition"
          >
            {t("cancel")}
          </Link>

          <button type="submit" className="btn-primary">
            <FaPlus />
            {t("saveExpense")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddExpense;
