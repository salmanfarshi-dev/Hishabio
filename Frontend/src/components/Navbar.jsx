import { useState } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { FaBars, FaTimes } from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";

function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: t("home"), target: "home" },
    { name: t("features"), target: "features" },
    { name: t("howItWorks"), target: "how-it-works" },
    { name: t("about"), target: "about" },
  ];

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const scrollProps = {
    smooth: "easeInOutQuart",
    duration: 700,
    offset: -80,
    spy: true,
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-xl">
      <nav className="container-main flex h-20 items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex w-32 shrink-0 items-center sm:w-40 lg:w-44 "
        >
          <img
            src="/Hishabio Logo.png"
            alt="Hishabio brand logo"
            className="h-auto max-h-14 w-full object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {navLinks.map((link) => (
            <ScrollLink
              key={link.target}
              to={link.target}
              {...scrollProps}
              className="cursor-pointer whitespace-nowrap text-sm font-semibold text-text transition hover:text-primary"
            >
              {link.name}
            </ScrollLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-heading transition hover:border-primary hover:text-primary"
          >
            {language === "en" ? "বাংলা" : "English"}
          </button>

          <Link
            to="/login"
            className="rounded-xl px-3 py-2.5 text-sm font-semibold text-heading transition hover:bg-light-indigo hover:text-primary"
          >
            {t("login")}
          </Link>

          <Link to="/register" className="btn-primary whitespace-nowrap">
            {t("getStarted")}
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex shrink-0 items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-heading transition hover:border-primary hover:text-primary"
          >
            {language === "en" ? "বাংলা" : "EN"}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-heading transition hover:border-primary hover:text-primary"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="border-t border-border bg-surface px-4 py-5 shadow-lg lg:hidden">
          <div className="container-main flex flex-col gap-2">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.target}
                to={link.target}
                {...scrollProps}
                onClick={closeMenu}
                className="cursor-pointer rounded-xl px-4 py-3 font-semibold text-text transition hover:bg-light-indigo hover:text-primary"
              >
                {link.name}
              </ScrollLink>
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
              className="btn-primary w-full justify-center"
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
