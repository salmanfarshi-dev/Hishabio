import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaWallet,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";

function Register() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // ====================
  // Register Form Submit
  // ====================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get("fullName").trim();
    const email = formData.get("email").trim().toLowerCase();
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please accept the terms and conditions.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        sessionStorage.setItem("hishabio-pending-email", email);

        toast.success("OTP sent to your email!");

        navigate("/verify-email", {
          state: { email },
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:flex lg:items-center lg:justify-center lg:p-8">
      {/* ====================
           Main Register Container
           ==================== */}

      <div className="container-main flex min-h-[calc(100vh-3rem)] max-w-[1440px] flex-col overflow-hidden rounded-3xl bg-surface p-0! shadow-xl shadow-primary/5 lg:min-h-[calc(100vh-4rem)] lg:flex-row">
        {/* ====================
             Left Side Branding
             ==================== */}

        <section className="relative hidden w-1/2 shrink-0 flex-col justify-between overflow-hidden bg-primary p-8 xl:p-12 lg:flex">
          {/* ====================
               Background Decoration
               ==================== */}

          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-secondary/40 blur-3xl" />

          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />

          {/* ====================
               Brand Logo
               ==================== */}

          <Link to="/" className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary">
              <FaWallet size={23} />
            </div>

            <span className="font-heading text-2xl font-extrabold text-white">
              Hisha<span className="text-white/70">bio</span>
            </span>
          </Link>

          {/* ====================
               Branding Content
               ==================== */}

          <div className="relative z-10 my-12 max-w-lg">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white">
              <FaUser size={28} />
            </div>

            <h1 className="font-heading text-3xl font-extrabold leading-tight text-white xl:text-5xl">
              {t("createYourAccount")}
            </h1>

            <p className="mt-6 max-w-md leading-8 text-white/80">
              {t("registerSubtitle")}
            </p>

            {/* ====================
                 Security Information
                 ==================== */}

            <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                  <FaShieldAlt size={20} />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-white">
                    Hishabio
                  </h3>

                  <p className="text-sm text-white/70">{t("secureLogin")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ====================
               Branding Footer
               ==================== */}

          <p className="relative z-10 text-sm text-white/70">
            © {new Date().getFullYear()} Hishabio. {t("copyright")}
          </p>
        </section>

        {/* ====================
             Right Side Register Form
             ==================== */}

        <section className="flex min-w-0 flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:px-8 xl:px-12">
          <div className="w-full max-w-md">
            {/* ====================
                 Mobile Brand Logo
                 ==================== */}

            <Link
              to="/"
              className="mb-10 flex items-center justify-center gap-3 lg:hidden"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                <FaWallet size={21} />
              </div>

              <span className="font-heading text-2xl font-extrabold text-heading">
                Hisha<span className="text-primary">bio</span>
              </span>
            </Link>

            {/* ====================
                 Form Heading
                 ==================== */}

            <div className="mb-8">
              <h2 className="font-heading text-3xl font-extrabold leading-tight text-heading sm:text-4xl">
                {t("createYourAccount")}
              </h2>

              <p className="mt-3 leading-7 text-muted">
                {t("registerSubtitle")}
              </p>
            </div>

            {/* ====================
                 Register Form
                 ==================== */}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ====================
                   Full Name Input
                   ==================== */}

              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-heading"
                >
                  {t("fullName")}
                </label>

                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder={t("enterFullName")}
                    autoComplete="name"
                    required
                    minLength={2}
                    className="w-full rounded-xl border border-border bg-surface py-3.5 pl-11 pr-4 text-heading outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* ====================
                   Email Input
                   ==================== */}

              <div>
                <label
                  htmlFor="registerEmail"
                  className="mb-2 block text-sm font-semibold text-heading"
                >
                  {t("emailAddress")}
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

                  <input
                    id="registerEmail"
                    type="email"
                    name="email"
                    placeholder={t("enterEmail")}
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-border bg-surface py-3.5 pl-11 pr-4 text-heading outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* ====================
                   Password Input
                   ==================== */}

              <div>
                <label
                  htmlFor="registerPassword"
                  className="mb-2 block text-sm font-semibold text-heading"
                >
                  {t("password")}
                </label>

                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

                  <input
                    id="registerPassword"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={t("enterPassword")}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-border bg-surface py-3.5 pl-11 pr-12 text-heading outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-muted">{t("passwordHint")}</p>
              </div>

              {/* ====================
                   Confirm Password Input
                   ==================== */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-heading"
                >
                  {t("confirmPassword")}
                </label>

                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder={t("enterConfirmPassword")}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-border bg-surface py-3.5 pl-11 pr-12 text-heading outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* ====================
                   Terms & Conditions
                   ==================== */}

              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-text">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 shrink-0 accent-primary"
                />

                <span>
                  {t("agreeTerms")}{" "}
                  <Link
                    to="/"
                    className="font-semibold text-primary hover:underline"
                  >
                    {t("termsConditions")}
                  </Link>{" "}
                  {t("and")}{" "}
                  <Link
                    to="/"
                    className="font-semibold text-primary hover:underline"
                  >
                    {t("privacyPolicy")}
                  </Link>
                </span>
              </label>

              {/* ====================
                   Register Button
                   ==================== */}

              <button
                type="submit"
                disabled={!agreeTerms || loading}
                className="btn-primary w-full py-4 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating Account..." : t("registerButton")}

                {!loading && <FaArrowRight />}
              </button>
            </form>

            {/* ====================
                 Login Link
                 ==================== */}

            <div className="mt-8 text-center">
              <p className="text-sm text-muted">
                {t("alreadyAccount")}{" "}
                <Link
                  to="/login"
                  className="font-bold text-primary transition hover:text-primary-hover"
                >
                  {t("signIn")}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;
