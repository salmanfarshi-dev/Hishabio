import { Link } from "react-router-dom";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

import Navbar from "../components/Navbar";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import About from "../components/About";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

import { useLanguage } from "../context/LanguageContext";

function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ====================
           Hero Section
           ==================== */}

      <section className="container-main flex min-h-[650px] flex-col items-center justify-center py-24 text-center">
        {/* ====================
             Hero Badge
             ==================== */}

        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-primary shadow-sm">
          <FaCheckCircle />
          {t("heroBadge")}
        </div>

        {/* ====================
             Hero Heading
             ==================== */}

        <h1 className="max-w-4xl font-heading text-4xl font-extrabold leading-tight tracking-tight text-heading md:text-6xl">
          {t("heroTitle")}
          <span className="text-primary"> {t("heroHighlight")}</span>
        </h1>

        {/* ====================
             Hero Description
             ==================== */}

        <p className="mt-7 max-w-2xl text-base leading-8 text-muted md:text-lg">
          {t("heroDescription")}
        </p>

        {/* ====================
             Hero Buttons
             ==================== */}

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link to="/register" className="btn-primary">
            {t("getStarted")}
            <FaArrowRight size={13} />
          </Link>

          <a
            href="#features"
            className="rounded-xl border border-border bg-surface px-6 py-3 font-semibold text-heading transition-all duration-200 hover:border-primary hover:text-primary"
          >
            {t("exploreFeatures")}
          </a>
        </div>

        {/* ====================
             Hero Note
             ==================== */}

        <p className="mt-6 text-sm text-muted">{t("heroNote")}</p>
      </section>

      {/* ====================
           Features Section
           ==================== */}

      <Features />

      {/* ====================
           How It Works Section
           ==================== */}

      <HowItWorks />

      {/* ====================
           About Section
           ==================== */}

      <About />

      {/* ====================
           CTA Section
           ==================== */}

      <CTA />

      {/* ====================
           Footer Section
           ==================== */}

      <Footer />
    </div>
  );
}

export default Home;
