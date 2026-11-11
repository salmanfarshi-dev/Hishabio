
import {
  FaWallet,
  FaUsers,
  FaBalanceScale,
  FaChartPie,
  FaHistory,
  FaShieldAlt,
} from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";

function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: FaWallet,
      title: "feature1",
      description: "feature1Description",
    },
    {
      icon: FaUsers,
      title: "feature2",
      description: "feature2Description",
    },
    {
      icon: FaBalanceScale,
      title: "feature3",
      description: "feature3Description",
    },
    {
      icon: FaChartPie,
      title: "feature4",
      description: "feature4Description",
    },
    {
      icon: FaHistory,
      title: "feature5",
      description: "feature5Description",
    },
    {
      icon: FaShieldAlt,
      title: "feature6",
      description: "feature6Description",
    },
  ];

  return (
    <section id="features" className="bg-surface py-24">

      <div className="container-main">

        {/* ====================
             Section Heading
             ==================== */}

        <div className="mx-auto mb-16 max-w-2xl text-center">

          <span className="inline-block rounded-full bg-light-indigo px-4 py-2 text-sm font-semibold text-primary">
            {t("featureBadge")}
          </span>

          <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-heading md:text-4xl">
            {t("featureTitle")}
            <span className="text-primary">
              {" "}{t("featureHighlight")}
            </span>
          </h2>

          <p className="mt-5 leading-8 text-muted">
            {t("featureDescription")}
          </p>

        </div>

        {/* ====================
             Features Grid
             ==================== */}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="card group p-7 transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >

                {/* ====================
                     Feature Icon
                     ==================== */}

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-light-indigo text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <Icon size={23} />
                </div>

                {/* ====================
                     Feature Content
                     ==================== */}

                <h3 className="mt-6 font-heading text-xl font-bold text-heading">
                  {t(feature.title)}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted">
                  {t(feature.description)}
                </p>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default Features;
