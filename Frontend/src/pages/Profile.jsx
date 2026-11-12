import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaSave } from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";

function Profile() {
  const { t } = useLanguage();

  const [profile, setProfile] = useState({
    name: "Salman Farshi",
    email: "salman@example.com",
    phone: "",
    bio: "Frontend Web Developer",
  });

  /* ====================
     Handle Input Change
     ==================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ====================
     Handle Profile Submit
     ==================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updated Profile:", profile);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ====================
          Page Header
          ==================== */}

      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
          {t("profile")}
        </h1>

        <p className="text-sm text-muted mt-2">{t("profileSubtitle")}</p>
      </div>

      {/* ====================
          Profile Overview
          ==================== */}

      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative w-24 h-24 rounded-full bg-light-indigo flex items-center justify-center text-primary text-3xl font-bold">
            SF
            <button
              type="button"
              aria-label="Change profile picture"
              disabled
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-surface flex items-center justify-center opacity-60 cursor-not-allowed"
            >
              <FaCamera className="text-sm" />
            </button>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-heading">
              {profile.name}
            </h2>

            <p className="text-sm text-muted mt-1">{profile.email}</p>

            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-light-indigo text-primary text-xs font-semibold">
              {t("householdMember")}
            </span>
          </div>
        </div>
      </div>

      {/* ====================
          Edit Profile Form
          ==================== */}

      <form onSubmit={handleSubmit} className="card p-5 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-heading font-bold text-heading">
            {t("personalInformation")}
          </h2>

          <p className="text-sm text-muted mt-1">
            {t("personalInformationDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}

          <div>
            <label className="block text-sm font-semibold text-heading mb-2">
              {t("fullName")}
            </label>

            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface text-heading outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Email */}

          <div>
            <label className="block text-sm font-semibold text-heading mb-2">
              {t("emailAddress")}
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

              <input
                type="email"
                name="email"
                value={profile.email}
                disabled
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface-hover text-muted outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone */}

          <div>
            <label className="block text-sm font-semibold text-heading mb-2">
              {t("phoneNumber")}
            </label>

            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder={t("enterPhoneNumber")}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface text-heading outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Bio */}

          <div>
            <label className="block text-sm font-semibold text-heading mb-2">
              {t("bio")}
            </label>

            <input
              type="text"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              placeholder={t("enterBio")}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-heading outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* ====================
            Save Button
            ==================== */}

        <div className="flex justify-end pt-4 border-t border-border">
          <button type="submit" className="btn-primary">
            <FaSave />
            {t("saveChanges")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
