
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
  FaWallet,
  FaChartPie,
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
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page min-h-screen bg-[#F4F6FC] px-4 py-6 sm:px-6 lg:flex lg:items-center lg:justify-center lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1250px] overflow-hidden rounded-[28px] bg-white shadow-[0_20px_80px_rgba(37,50,100,0.10)] lg:min-h-[780px]">

        {/* Left Branding Section */}
        <section className="relative hidden w-[48%] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#171B82] via-[#3024B8] to-[#7029E8] p-10 text-white lg:flex xl:p-14">

          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

          {/* Logo */}
          <Link
            to="/"
            className="relative z-10 inline-flex w-fit items-center rounded-2xl bg-white px-4 py-2.5 transition hover:scale-[1.02]"
          >
            <img
              src="/Hishabio%20Logo.png"
              alt="Hishabio"
              className="h-12 w-auto max-w-[220px] object-contain"
            />
          </Link>

          {/* Branding Content */}
          <div className="relative z-10 my-12 max-w-lg">
            <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-md">
              <FaUser size={27} />
            </div>

            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90">
              <span className="h-2 w-2 rounded-full bg-[#B7F7D2]" />
              Start your journey
            </span>

            <h1 className="font-heading text-4xl font-extrabold leading-[1.2] xl:text-5xl">
              {t("createYourAccount")}
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-white/75">
              {t("registerSubtitle")}
            </p>

            {/* Feature Card */}
            <div className="mt-10 space-y-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <FaShieldAlt size={19} />
                </div>

                <div>
                  <h3 className="font-bold">Secure & Private</h3>
                  <p className="mt-1 text-sm text-white/65">
                    {t("secureLogin")}
                  </p>
                </div>
              </div>

              <div className="h-px bg-white/15" />

              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-[#B7F7D2]" />
                <span className="text-sm text-white/85">
                  Create your personal account
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FaChartPie className="text-[#D9C5FF]" />
                <span className="text-sm text-white/85">
                  Organize shared household expenses
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="relative z-10 text-sm text-white/60">
            © {new Date().getFullYear()} Hishabio. {t("copyright")}
          </p>
        </section>

        {/* Right Register Section */}
        <section className="flex min-w-0 flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-20">
          <div className="w-full max-w-[420px]">

            {/* Mobile Logo */}
            <div className="mb-10 flex justify-center lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center rounded-2xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100"
              >
                <img
                  src="/Hishabio%20Logo.png"
                  alt="Hishabio"
                  className="h-12 w-auto max-w-[210px] object-contain"
                />
              </Link>
            </div>

            {/* Form Heading */}
            <div className="mb-8">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F0EDFF] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#6542D8]">
                <span className="h-2 w-2 rounded-full bg-[#7545E8]" />
                Create your account
              </span>

              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-[#171B35] sm:text-4xl">
                {t("createYourAccount")}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
                {t("registerSubtitle")}
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2.5 block text-sm font-semibold text-[#252A45]"
                >
                  {t("fullName")}
                </label>

                <div className="group relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#633CE6]" />

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder={t("enterFullName")}
                    autoComplete="name"
                    required
                    minLength={2}
                    className="w-full rounded-xl border border-slate-200 bg-[#FAFAFE] py-4 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#7147E8] focus:bg-white focus:ring-4 focus:ring-[#7147E8]/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="registerEmail"
                  className="mb-2.5 block text-sm font-semibold text-[#252A45]"
                >
                  {t("emailAddress")}
                </label>

                <div className="group relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#633CE6]" />

                  <input
                    id="registerEmail"
                    type="email"
                    name="email"
                    placeholder={t("enterEmail")}
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-[#FAFAFE] py-4 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#7147E8] focus:bg-white focus:ring-4 focus:ring-[#7147E8]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="registerPassword"
                  className="mb-2.5 block text-sm font-semibold text-[#252A45]"
                >
                  {t("password")}
                </label>

                <div className="group relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#633CE6]" />

                  <input
                    id="registerPassword"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={t("enterPassword")}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-[#FAFAFE] py-4 pl-11 pr-12 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#7147E8] focus:bg-white focus:ring-4 focus:ring-[#7147E8]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#633CE6]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  {t("passwordHint")}
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2.5 block text-sm font-semibold text-[#252A45]"
                >
                  {t("confirmPassword")}
                </label>

                <div className="group relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#633CE6]" />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder={t("enterConfirmPassword")}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-[#FAFAFE] py-4 pl-11 pr-12 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#7147E8] focus:bg-white focus:ring-4 focus:ring-[#7147E8]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#633CE6]"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-600">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#633CE6]"
                />

                <span>
                  {t("agreeTerms")}{" "}
                  <Link
                    to="/"
                    className="font-semibold text-[#633CE6] transition hover:underline"
                  >
                    {t("termsConditions")}
                  </Link>{" "}
                  {t("and")}{" "}
                  <Link
                    to="/"
                    className="font-semibold text-[#633CE6] transition hover:underline"
                  >
                    {t("privacyPolicy")}
                  </Link>
                </span>
              </label>

              {/* Register Button */}
              <button
                type="submit"
                disabled={!agreeTerms || loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#3926BD] to-[#7842E8] py-4 font-bold text-white shadow-lg shadow-[#633CE6]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#633CE6]/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? "Creating Account..." : t("registerButton")}

                {!loading && (
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                {t("alreadyAccount")}{" "}
                <Link
                  to="/login"
                  className="font-bold text-[#633CE6] transition hover:text-[#4020B5]"
                >
                  {t("signIn")}
                </Link>
              </p>
            </div>

            {/* Security Note */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
              <FaShieldAlt />
              <span>Your information is protected and secure</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;
