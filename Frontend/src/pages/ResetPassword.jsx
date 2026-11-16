import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaLock, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useLanguage } from "../context/LanguageContext";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error(
        language === "bn"
          ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"
          : "Password must be at least 6 characters",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        language === "bn"
          ? "দুটি পাসওয়ার্ড মিলছে না"
          : "Passwords do not match",
      );
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(`/auth/reset-password/${token}`, {
        password,
      });

      toast.success(response.data.message || "Password reset successful");

      navigate("/login");
    } catch (error) {
      console.error("Reset Password Error:", error);

      toast.error(
        error.response?.data?.message ||
          (language === "bn"
            ? "পাসওয়ার্ড পরিবর্তন করা যায়নি"
            : "Failed to reset password"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-3xl shadow-xl p-7 sm:p-10">
        <div className="flex justify-between items-center mb-10">
          <Link to="/">
            <h1 className="text-2xl font-heading font-extrabold text-primary">
              Hishabio.
            </h1>
          </Link>

          <button
            type="button"
            onClick={toggleLanguage}
            className="px-4 py-2 rounded-lg border border-border text-sm font-semibold text-heading hover:text-primary transition"
          >
            {language === "en" ? "বাংলা" : "English"}
          </button>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-light-indigo text-primary flex items-center justify-center mb-6">
          <FaLock className="text-2xl" />
        </div>

        <h2 className="text-3xl font-heading font-bold text-heading mb-3">
          {language === "bn"
            ? "নতুন পাসওয়ার্ড সেট করুন"
            : "Create New Password"}
        </h2>

        <p className="text-muted leading-7 mb-8">
          {language === "bn"
            ? "আপনার অ্যাকাউন্টের জন্য একটি নতুন নিরাপদ পাসওয়ার্ড তৈরি করুন।"
            : "Create a new secure password for your account."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-heading mb-2">
              {language === "bn" ? "নতুন পাসওয়ার্ড" : "New Password"}
            </label>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  language === "bn"
                    ? "নতুন পাসওয়ার্ড লিখুন"
                    : "Enter new password"
                }
                minLength={6}
                required
                disabled={loading}
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border bg-background text-heading outline-none focus:border-primary focus:ring-4 focus:ring-light-indigo transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-heading mb-2">
              {language === "bn"
                ? "পাসওয়ার্ড নিশ্চিত করুন"
                : "Confirm Password"}
            </label>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={
                  language === "bn"
                    ? "আবার পাসওয়ার্ড লিখুন"
                    : "Confirm new password"
                }
                minLength={6}
                required
                disabled={loading}
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border bg-background text-heading outline-none focus:border-primary focus:ring-4 focus:ring-light-indigo transition"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? language === "bn"
                ? "পরিবর্তন হচ্ছে..."
                : "Updating..."
              : language === "bn"
                ? "পাসওয়ার্ড পরিবর্তন করুন"
                : "Reset Password"}
          </button>
        </form>

        <div className="mt-7 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <FaArrowLeft />
            {language === "bn" ? "লগইনে ফিরে যান" : "Back to Login"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
