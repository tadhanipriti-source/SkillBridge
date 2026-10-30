
import { useEffect, useState } from "react";
import API from "../api/axios";

function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    education: "",
    college: "",
    skills: "",
    location: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token =
          sessionStorage.getItem("token") ||
          localStorage.getItem("token");

        if (!token) {
          setError("Please login again.");
          return;
        }

        const response = await API.get("/student/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data.user;
        const profile = user.studentProfile || {};

        setFormData({
          name: user.name || "",
          phone: profile.phone || "",
          education: profile.education || "",
          college: profile.college || "",
          skills: (profile.skills || []).join(", "),
          location: profile.location || "",
          bio: profile.bio || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const token =
        sessionStorage.getItem("token") ||
        localStorage.getItem("token");

      await API.put(
        "/student/profile",
        {
          ...formData,
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center p-10">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold text-gray-800">
          My Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Update your personal and educational details.
        </p>

        {message && (
          <p className="bg-green-100 text-green-700 p-3 rounded-lg mt-5">
            {message}
          </p>
        )}

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mt-5">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {[
            { label: "Full Name", name: "name" },
            { label: "Phone Number", name: "phone" },
            { label: "Education", name: "education" },
            { label: "College", name: "college" },
            { label: "Skills (comma separated)", name: "skills" },
            { label: "Location", name: "location" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block font-semibold text-gray-700 mb-2">
                {field.label}
              </label>

              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              About Me
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
