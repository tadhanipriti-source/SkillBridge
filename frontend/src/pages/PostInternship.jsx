
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function PostInternship() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    skills: "",
    location: "",
    workMode: "onsite",
    duration: "",
    stipend: 0,
    openings: 1,
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token =
        sessionStorage.getItem("token") ||
        localStorage.getItem("token");

      if (!token) {
        setError("Please login again as a company.");
        return;
      }

      const response = await API.post(
        "/internships",
        {
          ...formData,
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          stipend: Number(formData.stipend),
          openings: Number(formData.openings),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Internship posted successfully!");

      setTimeout(() => {
        navigate("/company-dashboard");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to post internship."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">

        <h1 className="text-3xl font-bold text-gray-800">
          Post Internship
        </h1>

        <p className="text-gray-500 mt-2">
          Create a new internship opportunity for students.
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

          <div>
            <label className="block font-semibold mb-2">
              Internship Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Python Developer Intern"
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the internship..."
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Example: Web Development"
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Python, Django, SQL"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Example: Surat, Gujarat"
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Work Mode
            </label>
            <select
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="onsite">Onsite</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Example: 3 Months"
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Monthly Stipend (₹)
            </label>
            <input
              type="number"
              name="stipend"
              value={formData.stipend}
              onChange={handleChange}
              min="0"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Number of Openings
            </label>
            <input
              type="number"
              name="openings"
              value={formData.openings}
              onChange={handleChange}
              min="1"
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Application Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={new Date().toLocaleDateString("en-CA")}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Internship"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default PostInternship;
