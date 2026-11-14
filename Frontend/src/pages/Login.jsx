import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaWallet,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // ====================
  // Form States
  // ====================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ====================
  // Authentication States
  // ====================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ====================
  // Login Form Submit
  // ====================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Save authentication data
      const storage = rememberMe ? localStorage : sessionStorage;

      // Remove previous authentication data
      localStorage.removeItem("hishabio-token");
      localStorage.removeItem("hishabio-user");
      sessionStorage.removeItem("hishabio-token");
      sessionStorage.removeItem("hishabio-user");

      // Store new authentication data
      storage.setItem("hishabio-token", token);
      storage.setItem("hishabio-user", JSON.stringify(user));

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:flex lg:items-center lg:justify-center lg:p-8">
      {/* ====================
          Main Login Container
          ==================== */}

      <div className="container-main flex min-h-[calc(100vh-3rem)] max-w-[1440px] flex-col overflow-hidden rounded-3xl bg-surface p-0! shadow-xl shadow-primary/5 lg:min-h-[calc(100vh-4rem)] lg:flex-row">
        {/* ====================
            Left Side Branding
            ==================== */}

        <section className="relative hidden w-1/2 shrink-0 flex-col justify-between overflow-hidden bg-primary p-8 lg:flex xl:p-12">
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
              <FaWallet size={30} />
            </div>

            <h1 className="font-heading text-3xl font-extrabold leading-tight text-white xl:text-5xl">
              {t("heroTitle")}
              <br />
              {t("heroHighlight")}
            </h1>

            <p className="mt-6 max-w-md leading-8 text-white/80">
              {t("heroDescription")}
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
            Right Side Login Form
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

            <div className="mb-9">
              <h2 className="font-heading text-3xl font-extrabold leading-tight text-heading sm:text-4xl">
                {t("welcomeBack")}
              </h2>

              <p className="mt-3 leading-7 text-muted">{t("loginSubtitle")}</p>
            </div>

            {/* ====================
                Login Form
                ==================== */}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ====================
                  Email Input
                  ==================== */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-heading"
                >
                  {t("emailAddress")}
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder={t("enterEmail")}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-heading"
                >
                  {t("password")}
                </label>

                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={t("enterPassword")}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-surface py-3.5 pl-11 pr-12 text-heading outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* ====================
                  Remember Me & Forgot Password
                  ==================== */}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-text">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />

                  {t("rememberMe")}
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-primary transition hover:text-primary-hover"
                >
                  {t("forgotPassword")}
                </Link>
              </div>

              {/* ====================
                  Error Message
                  ==================== */}

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger"
                >
                  {error}
                </p>
              )}

              {/* ====================
                  Login Button
                  ==================== */}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex w-full items-center justify-center gap-3 py-4 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : t("loginButton")}

                {!loading && <FaArrowRight />}
              </button>
            </form>

            {/* ====================
                Register Link
                ==================== */}

            <div className="mt-8 text-center">
              <p className="text-sm text-muted">
                {t("noAccount")}{" "}
                <Link
                  to="/register"
                  className="font-bold text-primary transition hover:text-primary-hover"
                >
                  {t("createAccount")}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
