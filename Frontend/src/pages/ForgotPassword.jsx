import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";
function ForgotPassword() {
  const { language, toggleLanguage, t } = useLanguage();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ====================
  // Handle Form Submit
  // ====================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    console.log("Reset email:", email);
    toast.success(t("resetEmailSent"));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 overflow-hidden rounded-3xl bg-surface border border-border shadow-xl">
        {/* ====================
            Left Branding Panel
            ==================== */}

        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary to-secondary p-12 text-white relative overflow-hidden">
          <div className="absolute w-72 h-72 rounded-full border border-white/10 -top-20 -right-20" />
          <div className="absolute w-96 h-96 rounded-full border border-white/10 -bottom-40 -left-20" />

          <Link to="/" className="relative z-10">
            <h1 className="text-3xl font-heading font-extrabold">
              Hishabio<span className="text-white/70">.</span>
            </h1>
            <p className="text-white/75 text-sm mt-1">
              Share Expenses. Simplify Life.
            </p>
          </Link>

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-7">
              <FaLock className="text-3xl" />
            </div>

            <h2 className="text-4xl font-heading font-bold leading-tight mb-5">
              {language === "bn"
                ? "আপনার অ্যাকাউন্টের নিরাপত্তা আমাদের কাছে গুরুত্বপূর্ণ।"
                : "Your account security matters to us."}
            </h2>

            <p className="text-white/80 leading-8 max-w-md">
              {language === "bn"
                ? "আপনার অ্যাকাউন্টে নিরাপদে ফিরে যেতে সহজেই পাসওয়ার্ড রিসেট করুন।"
                : "Reset your password securely and get back to managing your shared expenses."}
            </p>
          </div>

          <p className="relative z-10 text-white/60 text-sm">
            © 2026 Hishabio. All rights reserved.
          </p>
        </div>

        {/* ====================
            Forgot Password Form
            ==================== */}

        <div className="p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
          {/* ====================
              Top Navigation
              ==================== */}

          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="lg:hidden">
              <h1 className="text-2xl font-heading font-extrabold text-primary">
                Hishabio.
              </h1>
            </Link>

            <Link
              to="/"
              className="hidden lg:flex items-center gap-2 text-sm text-muted hover:text-primary transition"
            >
              <FaArrowLeft />
              {language === "bn" ? "হোমে ফিরে যান" : "Back to Home"}
            </Link>

            <button
              type="button"
              onClick={toggleLanguage}
              className="ml-auto px-4 py-2 rounded-lg border border-border text-sm font-semibold text-heading hover:bg-light-indigo hover:text-primary transition"
            >
              {language === "en" ? "বাংলা" : "English"}
            </button>
          </div>

          {!submitted ? (
            <>
              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-light-indigo text-primary flex items-center justify-center mb-6">
                  <FaLock className="text-2xl" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-heading mb-4">
                  {t("forgotPasswordTitle")}
                </h2>

                <p className="text-muted leading-7">
                  {t("forgotPasswordSubtitle")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ====================
                    Email Input
                    ==================== */}

                <div>
                  <label className="block text-sm font-semibold text-heading mb-2">
                    {t("emailAddress")}
                  </label>

                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("enterEmail")}
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-background text-heading outline-none focus:border-primary focus:ring-4 focus:ring-light-indigo transition"
                    />
                  </div>
                </div>

                {/* ====================
                    Submit Button
                    ==================== */}

                <button type="submit" className="btn-primary w-full py-3.5">
                  {t("sendResetLink")}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-50 text-success flex items-center justify-center mb-6">
                <FaCheckCircle className="text-4xl" />
              </div>

              <h2 className="text-3xl font-heading font-bold text-heading mb-4">
                {language === "bn"
                  ? "ইমেইল পাঠানো হয়েছে!"
                  : "Check Your Email!"}
              </h2>

              <p className="text-muted leading-7 mb-3">{t("resetEmailSent")}</p>

              <p className="text-primary font-semibold break-all mb-8">
                {email}
              </p>

              <button
                onClick={() => setSubmitted(false)}
                className="text-primary font-semibold hover:underline"
              >
                {language === "bn" ? "আবার চেষ্টা করুন" : "Try another email"}
              </button>
            </div>
          )}

          {/* ====================
              Back To Login
              ==================== */}

          <div className="mt-8 text-center">
            <p className="text-sm text-muted">
              {t("rememberPassword")}{" "}
              <Link
                to="/login"
                className="font-bold text-primary hover:underline"
              >
                {t("backToLogin")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
