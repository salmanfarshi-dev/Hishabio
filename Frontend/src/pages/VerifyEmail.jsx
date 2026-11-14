import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaWallet,
  FaEnvelope,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";

import API from "../api/axios";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email ||
    sessionStorage.getItem("hishabio-pending-email") ||
    "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ====================
  // OTP Verification
  // ====================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please register again.");
      navigate("/register");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/verify-email", {
        email,
        otp,
      });

      if (response.data.success) {
        sessionStorage.removeItem("hishabio-pending-email");

        toast.success("Email verified successfully!");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Email verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      {/* ====================
          Verification Container
          ==================== */}

      <div className="w-full max-w-md rounded-3xl bg-surface p-6 shadow-xl shadow-primary/5 sm:p-10">
        {/* ====================
            Brand Logo
            ==================== */}

        <Link to="/" className="mb-10 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <FaWallet size={22} />
          </div>

          <span className="font-heading text-2xl font-extrabold text-heading">
            Hisha<span className="text-primary">bio</span>
          </span>
        </Link>

        {/* ====================
            Verification Icon
            ==================== */}

        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-light-indigo text-primary">
            <FaShieldAlt size={35} />
          </div>
        </div>

        {/* ====================
            Heading
            ==================== */}

        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-extrabold text-heading">
            Verify Your Email
          </h1>

          <p className="mt-3 leading-7 text-muted">
            ইমেইল যাচাই করুন / Enter the 6-digit verification code sent to your
            email address.
          </p>

          {email && (
            <div className="mt-4 flex items-center justify-center gap-2 break-all text-sm font-semibold text-primary">
              <FaEnvelope className="shrink-0" />
              {email}
            </div>
          )}
        </div>

        {/* ====================
            OTP Form
            ==================== */}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="otp"
              className="mb-3 block text-sm font-semibold text-heading"
            >
              Verification Code / OTP
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
              required
              className="w-full rounded-xl border border-border bg-surface px-4 py-4 text-center text-2xl font-extrabold tracking-[0.5em] text-primary outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />

            <p className="mt-2 text-xs text-muted">
              OTP is valid for 5 minutes.
            </p>
          </div>

          {/* ====================
              Submit Button
              ==================== */}

          <button
            type="submit"
            disabled={loading || otp.length !== 6 || !email}
            className="btn-primary w-full py-4 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Email"}

            {!loading && <FaArrowRight />}
          </button>
        </form>

        {/* ====================
            Footer
            ==================== */}

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-sm text-muted">
            Already verified?{" "}
            <Link
              to="/login"
              className="font-bold text-primary transition hover:text-primary-hover"
            >
              Sign In
            </Link>
          </p>

          <p className="mt-4 text-xs leading-6 text-muted">
            Didn't receive your code? Check your spam folder or register again
            if your OTP has expired.
          </p>
        </div>
      </div>
    </main>
  );
}

export default VerifyEmail;
