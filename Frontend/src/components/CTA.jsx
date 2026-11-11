import { Link } from "react-router-dom";
import { FaArrowRight, FaUsers } from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";

function CTA() {
  const { t } = useLanguage();

  return (
    <section className="bg-background py-20">
      <div className="container-main">
        {/* ====================
             CTA Container
             ==================== */}

        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center sm:px-12">
          {/* ====================
               Background Decoration
               ==================== */}

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-secondary/50 blur-2xl" />

          {/* ====================
               CTA Content
               ==================== */}

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white">
              <FaUsers size={28} />
            </div>

            <h2 className="mt-7 font-heading text-3xl font-extrabold leading-tight text-white md:text-4xl">
              {t("ctaTitle")}
            </h2>

            <p className="mt-5 leading-8 text-white/80">
              {t("ctaDescription")}
            </p>

            {/* ====================
                 CTA Button
                 ==================== */}

            <Link
              to="/register"
              className="mt-9 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 font-bold text-primary shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-light-indigo"
            >
              {t("ctaButton")}
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
