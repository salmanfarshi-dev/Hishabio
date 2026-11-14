import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaSave } from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";
import toast from "react-hot-toast";

function Profile() {
  const { t } = useLanguage();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });
  const [householdRole, setHouseholdRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/auth/me");

        const user = response.data.user || response.data.data || response.data;

        setProfile({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          profileImage: user.profileImage || "",
        });
        const householdId = localStorage.getItem("hishabio-household-id");

        if (householdId && user._id) {
          const membersResponse = await API.get(
            `/households/${householdId}/members`,
          );

          const members = membersResponse.data.members || [];

          const currentMember = members.find(
            (member) => member.user?._id === user._id,
          );

          setHouseholdRole(currentMember?.role || "");
        }

        // Keep local user information updated
        localStorage.setItem("hishabio-user", JSON.stringify(user));
      } catch (error) {
        console.error("Profile loading error:", error);
        toast.error(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Update Profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await API.put("/auth/profile", {
        name: profile.name.trim(),
        phone: profile.phone.trim(),
      });

      const updatedUser =
        response.data.user || response.data.data || response.data;

      setProfile((previous) => ({
        ...previous,
        name: updatedUser.name ?? previous.name,
        phone: updatedUser.phone ?? previous.phone,
        email: updatedUser.email ?? previous.email,
        profileImage: updatedUser.profileImage ?? previous.profileImage,
      }));

      localStorage.setItem("hishabio-user", JSON.stringify(updatedUser));

      toast.success(response.data.message || "Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Upload Profile Image
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await API.put("/auth/profile/image", formData);

      const updatedUser =
        response.data.user || response.data.data || response.data;

      const imageUrl = updatedUser.profileImage || response.data.profileImage;

      if (!imageUrl) {
        throw new Error("Profile image URL was not returned.");
      }

      setProfile((previous) => ({
        ...previous,
        profileImage: imageUrl,
      }));

      const savedUser = JSON.parse(
        localStorage.getItem("hishabio-user") || "{}",
      );

      localStorage.setItem(
        "hishabio-user",
        JSON.stringify({
          ...savedUser,
          ...updatedUser,
          profileImage: imageUrl,
        }),
      );

      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-muted">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}

      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
          {t("profile")}
        </h1>

        <p className="text-sm text-muted mt-2">{t("profileSubtitle")}</p>
      </div>

      {/* Profile Overview */}

      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative w-24 h-24 rounded-full bg-light-indigo flex items-center justify-center text-primary text-3xl font-bold overflow-hidden">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              profile.name?.charAt(0)?.toUpperCase() || "U"
            )}

            <label
              htmlFor="profileImage"
              className={`absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-surface flex items-center justify-center cursor-pointer ${
                uploading ? "opacity-60" : ""
              }`}
              title="Change profile picture"
            >
              <FaCamera className="text-sm" />
            </label>

            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-heading">
              {profile.name}
            </h2>

            <p className="text-sm text-muted mt-1">{profile.email}</p>

            {householdRole && (
              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-light-indigo text-primary text-xs font-semibold capitalize">
                {householdRole}
              </span>
            )}

            {uploading && (
              <p className="text-xs text-primary mt-2">Uploading image...</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}

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
        </div>

        {/* Save Button */}

        <div className="flex justify-end pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FaSave />
            {saving ? "Saving..." : t("saveChanges")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
