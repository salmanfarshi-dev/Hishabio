import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaWallet, FaBars, FaTimes } from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";

function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: t("home"), path: "/#home" },
    { name: t("features"), path: "/#features" },
    { name: t("howItWorks"), path: "/#how-it-works" },
    { name: t("about"), path: "/#about" },
  ];

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-xl">
      <nav className="container-main flex h-20 items-center justify-between">
        {/* ====================
             Brand Logo
             ==================== */}

        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
            <FaWallet size={21} />
          </div>

          <span className="font-heading text-2xl font-extrabold text-heading">
            Hisha<span className="text-primary">bio</span>
          </span>
        </Link>

        {/* ====================
             Desktop Navigation
             ==================== */}

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className="text-sm font-semibold text-text transition hover:text-primary"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* ====================
             Desktop Actions
             ==================== */}

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-heading transition hover:border-primary hover:text-primary"
          >
            {language === "en" ? "বাংলা" : "English"}
          </button>

          <Link
            to="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-heading transition hover:bg-light-indigo hover:text-primary"
          >
            {t("login")}
          </Link>

          <Link to="/register" className="btn-primary">
            {t("getStarted")}
          </Link>
        </div>

        {/* ====================
             Mobile Actions
             ==================== */}

        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-heading"
          >
            {language === "en" ? "বাংলা" : "EN"}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-heading transition hover:border-primary hover:text-primary"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </nav>

      {/* ====================
           Mobile Dropdown Menu
           ==================== */}

      {menuOpen && (
        <div className="border-t border-border bg-surface px-6 py-5 shadow-lg lg:hidden">
          <div className="container-main flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 font-semibold text-text transition hover:bg-light-indigo hover:text-primary"
              >
                {link.name}
              </a>
            ))}

            <div className="my-2 border-t border-border" />

            <Link
              to="/login"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 font-semibold text-heading transition hover:bg-light-indigo hover:text-primary"
            >
              {t("login")}
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className="btn-primary w-full"
            >
              {t("getStarted")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
