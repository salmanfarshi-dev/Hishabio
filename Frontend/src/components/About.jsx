import { FaCheckCircle, FaHeart, FaUsers, FaWallet } from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";

function About() {
  const { t } = useLanguage();

  const benefits = ["benefit1", "benefit2", "benefit3", "benefit4"];

  return (
    <section id="about" className="bg-surface py-24">
      <div className="container-main grid items-center gap-16 lg:grid-cols-2">
        {/* ====================
             About Content
             ==================== */}

        <div>
          <span className="inline-block rounded-full bg-light-indigo px-4 py-2 text-sm font-semibold text-primary">
            {t("aboutBadge")}
          </span>

          <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight tracking-tight text-heading md:text-4xl">
            {t("aboutTitle")}
            <span className="text-primary"> {t("aboutHighlight")}</span>
          </h2>

          <p className="mt-6 leading-8 text-muted">{t("aboutDescription")}</p>

          {/* ====================
               Benefits List
               ==================== */}

          <div className="mt-8 space-y-5">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <FaCheckCircle className="mt-1 shrink-0 text-success" />

                <p className="text-sm font-medium text-text">{t(benefit)}</p>
              </div>
            ))}
          </div>

          {/* ====================
               Supporting Message
               ==================== */}

          <div className="mt-9 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-light-indigo text-primary">
              <FaHeart size={20} />
            </div>

            <div>
              <h3 className="font-heading font-bold text-heading">Hishabio</h3>

              <p className="text-sm text-muted">{t("tagline")}</p>
            </div>
          </div>
        </div>

        {/* ====================
             Expense Summary Card
             ==================== */}

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-5 rounded-3xl bg-light-indigo/70 blur-2xl" />

          <div className="card relative overflow-hidden p-7 sm:p-9">
            {/* ====================
                 Card Header
                 ==================== */}

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-heading">
                  {t("aboutBadge")}
                </h3>

                <p className="mt-1 text-sm text-muted">{t("totalExpenses")}</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-light-indigo text-primary">
                <FaWallet size={21} />
              </div>
            </div>

            {/* ====================
                 Total Amount
                 ==================== */}

            <h2 className="mt-7 font-heading text-4xl font-extrabold text-heading">
              ৳12,000
            </h2>

            <div className="my-7 border-t border-border" />

            {/* ====================
                 Expense Information
                 ==================== */}

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-light-indigo p-4">
                <p className="text-sm text-muted">{t("yourShare")}</p>

                <h3 className="mt-2 font-heading text-2xl font-bold text-primary">
                  ৳3,000
                </h3>
              </div>

              <div className="rounded-xl bg-surface-hover p-4">
                <p className="text-sm text-muted">{t("members")}</p>

                <div className="mt-2 flex items-center gap-2">
                  <FaUsers className="text-secondary" />

                  <h3 className="font-heading text-2xl font-bold text-heading">
                    4
                  </h3>
                </div>
              </div>
            </div>

            {/* ====================
                 Card Footer
                 ==================== */}

            <p className="mt-6 text-center text-xs text-muted">
              {languageNote(t)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function languageNote(t) {
  return t("totalExpenses") === "মোট যৌথ খরচ"
    ? "এটি একটি নমুনা হিসাব।"
    : "This is an illustrative example.";
}

export default About;
