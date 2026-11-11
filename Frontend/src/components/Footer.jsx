
import { Link } from "react-router-dom";
import {
  FaWallet,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaArrowRight,
} from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-surface pt-16">

      <div className="container-main">

        {/* ====================
             Footer Main Content
             ==================== */}

        <div className="grid gap-12 pb-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* ====================
               Brand Information
               ==================== */}

          <div>

            <Link to="/" className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                <FaWallet size={21} />
              </div>

              <span className="font-heading text-2xl font-extrabold text-heading">
                Hisha<span className="text-primary">bio</span>
              </span>

            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-muted">
              {t("footerDescription")}
            </p>

            <p className="mt-4 text-sm font-semibold text-primary">
              {t("tagline")}
            </p>

          </div>

          {/* ====================
               Quick Links
               ==================== */}

          <div>

            <h3 className="font-heading text-lg font-bold text-heading">
              {t("quickLinks")}
            </h3>

            <ul className="mt-5 space-y-4 text-sm text-muted">

              <li>
                <a href="#home" className="transition hover:text-primary">
                  {t("home")}
                </a>
              </li>

              <li>
                <a href="#features" className="transition hover:text-primary">
                  {t("features")}
                </a>
              </li>

              <li>
                <a href="#how-it-works" className="transition hover:text-primary">
                  {t("howItWorks")}
                </a>
              </li>

              <li>
                <a href="#about" className="transition hover:text-primary">
                  {t("about")}
                </a>
              </li>

            </ul>

          </div>

          {/* ====================
               Account Links
               ==================== */}

          <div>

            <h3 className="font-heading text-lg font-bold text-heading">
              {t("yourAccount")}
            </h3>

            <ul className="mt-5 space-y-4 text-sm text-muted">

              <li>
                <Link to="/login" className="transition hover:text-primary">
                  {t("login")}
                </Link>
              </li>

              <li>
                <Link to="/register" className="transition hover:text-primary">
                  {t("getStarted")}
                </Link>
              </li>

              <li>
                <Link to="/forgot-password" className="transition hover:text-primary">
                  {t("forgotPassword")}
                </Link>
              </li>

            </ul>

          </div>

          {/* ====================
               Social Links
               ==================== */}

          <div>

            <h3 className="font-heading text-lg font-bold text-heading">
              {t("stayConnected")}
            </h3>

            <p className="mt-5 text-sm leading-7 text-muted">
              {t("footerUpdates")}
            </p>

            <div className="mt-5 flex items-center gap-3">

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-light-indigo text-primary transition hover:bg-primary hover:text-white"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-light-indigo text-primary transition hover:bg-primary hover:text-white"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-light-indigo text-primary transition hover:bg-primary hover:text-white"
              >
                <FaLinkedinIn />
              </a>

            </div>

            <Link
              to="/register"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:gap-3"
            >
              {t("joinHishabio")}
              <FaArrowRight />
            </Link>

          </div>

        </div>

        {/* ====================
             Footer Bottom
             ==================== */}

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 text-center sm:flex-row">

          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Hishabio. {t("copyright")}
          </p>

          <p className="text-sm font-medium text-muted">
            {t("tagline")}
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
