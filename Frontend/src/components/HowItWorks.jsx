
import {
  FaUserPlus,
  FaUsers,
  FaReceipt,
  FaCalculator,
} from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";

function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      icon: FaUserPlus,
      title: "step1",
      description: "step1Description",
    },
    {
      number: "02",
      icon: FaUsers,
      title: "step2",
      description: "step2Description",
    },
    {
      number: "03",
      icon: FaReceipt,
      title: "step3",
      description: "step3Description",
    },
    {
      number: "04",
      icon: FaCalculator,
      title: "step4",
      description: "step4Description",
    },
  ];

  return (
    <section id="how-it-works" className="bg-background py-24">

      <div className="container-main">

        {/* ====================
             Section Heading
             ==================== */}

        <div className="mx-auto mb-16 max-w-2xl text-center">

          <span className="inline-block rounded-full bg-light-indigo px-4 py-2 text-sm font-semibold text-primary">
            {t("processBadge")}
          </span>

          <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-heading md:text-4xl">
            {t("processTitle")}
            <span className="text-primary">
              {" "}{t("processHighlight")}
            </span>
          </h2>

          <p className="mt-5 leading-8 text-muted">
            {t("processDescription")}
          </p>

        </div>

        {/* ====================
             Steps Grid
             ==================== */}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">

                <div className="card h-full p-7 transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">

                  {/* ====================
                       Step Number
                       ==================== */}

                  <div className="flex items-center justify-between">

                    <span className="font-heading text-4xl font-extrabold text-primary/20">
                      {step.number}
                    </span>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-light-indigo text-primary">
                      <Icon size={23} />
                    </div>

                  </div>

                  {/* ====================
                       Step Content
                       ==================== */}

                  <h3 className="mt-7 font-heading text-lg font-bold text-heading">
                    {t(step.title)}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted">
                    {t(step.description)}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;
