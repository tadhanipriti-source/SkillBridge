
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function MyInternships() {
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const [editData, setEditData] = useState({});

  const getToken = () =>
    sessionStorage.getItem("token") ||
    localStorage.getItem("token");

  const fetchInternships = async () => {
    try {
      const token = getToken();

      if (!token) {
        setError("Please login again as a company.");
        return;
      }

      const response = await API.get(
        "/internships/company/my-internships",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInternships(response.data.internships || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load your internships."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  // Start Editing
  const handleEdit = (internship) => {
    setEditingId(internship._id);

    setEditData({
      title: internship.title || "",
      description: internship.description || "",
      category: internship.category || "",
      skills: internship.skills?.join(", ") || "",
      location: internship.location || "",
      workMode: internship.workMode || "onsite",
      duration: internship.duration || "",
      stipend: internship.stipend ?? 0,
      openings: internship.openings ?? 1,
      deadline: internship.deadline
        ? new Date(internship.deadline).toISOString().slice(0, 10)
        : "",
      status: internship.status || "active",
    });
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save Updated Internship
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await API.put(
        `/internships/${editingId}`,
        {
          ...editData,
          skills: editData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          stipend: Number(editData.stipend),
          openings: Number(editData.openings),
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      alert("Internship updated successfully!");

      setEditingId("");
      setEditData({});

      await fetchInternships();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to update internship."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete Internship
  const handleDelete = async (internshipId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this internship?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(internshipId);

      await API.delete(
        `/internships/${internshipId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      alert("Internship deleted successfully!");

      setInternships((prev) =>
        prev.filter((item) => item._id !== internshipId)
      );

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to delete internship."
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Posted Internships
            </h1>

            <p className="text-gray-500 mt-2">
              Manage all your internship opportunities.
            </p>
          </div>

          <button
            onClick={() => navigate("/post-internship")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            + Post New Internship
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <p className="mt-8 text-gray-600">
            Loading internships...
          </p>
        ) : error ? (
          <p className="mt-8 text-red-600">{error}</p>
        ) : internships.length === 0 ? (
          <div className="bg-white p-8 rounded-xl mt-8 text-center">
            <p className="text-gray-500">
              You have not posted any internships yet.
            </p>
          </div>
        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

            {internships.map((internship) => (
              <div
                key={internship._id}
                className="bg-white p-6 rounded-xl shadow-sm border"
              >

                {editingId === internship._id ? (

                  /* Edit Form */
                  <form onSubmit={handleUpdate}>

                    <h2 className="text-xl font-bold mb-5">
                      Edit Internship
                    </h2>

                    <div className="space-y-4">

                      <input
                        name="title"
                        value={editData.title}
                        onChange={handleChange}
                        placeholder="Internship Title"
                        required
                        className="w-full border rounded-lg p-3"
                      />

                      <textarea
                        name="description"
                        value={editData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        required
                        rows="4"
                        className="w-full border rounded-lg p-3"
                      />

                      <input
                        name="category"
                        value={editData.category}
                        onChange={handleChange}
                        placeholder="Category"
                        required
                        className="w-full border rounded-lg p-3"
                      />

                      <input
                        name="skills"
                        value={editData.skills}
                        onChange={handleChange}
                        placeholder="Skills separated by commas"
                        className="w-full border rounded-lg p-3"
                      />

                      <input
                        name="location"
                        value={editData.location}
                        onChange={handleChange}
                        placeholder="Location"
                        required
                        className="w-full border rounded-lg p-3"
                      />

                      <select
                        name="workMode"
                        value={editData.workMode}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                      >
                        <option value="onsite">Onsite</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                      </select>

                      <input
                        name="duration"
                        value={editData.duration}
                        onChange={handleChange}
                        placeholder="Duration"
                        required
                        className="w-full border rounded-lg p-3"
                      />

                      <input
                        type="number"
                        name="stipend"
                        value={editData.stipend}
                        onChange={handleChange}
                        min="0"
                        placeholder="Stipend"
                        className="w-full border rounded-lg p-3"
                      />

                      <input
                        type="number"
                        name="openings"
                        value={editData.openings}
                        onChange={handleChange}
                        min="1"
                        required
                        placeholder="Openings"
                        className="w-full border rounded-lg p-3"
                      />

                      <div>
                        <label className="block mb-2 font-medium">
                          Application Deadline
                        </label>

                        <input
                          type="date"
                          name="deadline"
                          value={editData.deadline}
                          onChange={handleChange}
                          required
                          className="w-full border rounded-lg p-3"
                        />
                      </div>

                      <select
                        name="status"
                        value={editData.status}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                      >
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                      </select>

                    </div>

                    <div className="flex gap-3 mt-5">

                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingId("")}
                        className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600"
                      >
                        Cancel
                      </button>

                    </div>

                  </form>

                ) : (

                  /* Internship Card */
                  <>
                    <div className="flex justify-between items-center">

                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {internship.category}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          internship.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {internship.status}
                      </span>

                    </div>

                    <h2 className="text-xl font-bold text-gray-800 mt-5">
                      {internship.title}
                    </h2>

                    <p className="text-gray-500 mt-3">
                      {internship.description}
                    </p>

                    <div className="space-y-2 mt-5 text-gray-700">
                      <p>📍 {internship.location}</p>
                      <p>💰 ₹{internship.stipend}/month</p>
                      <p>⏳ {internship.duration}</p>
                      <p>💼 {internship.workMode}</p>
                      <p>👥 {internship.openings} Openings</p>
                    </div>

                    <div className="mt-5">
                      <p className="font-semibold text-gray-700">
                        Skills:
                      </p>

                      <p className="text-gray-500 mt-1">
                        {internship.skills?.join(", ") || "Not specified"}
                      </p>
                    </div>

                    <p className="text-sm text-gray-500 mt-5">
                      Deadline:{" "}
                      {new Date(internship.deadline).toLocaleDateString("en-IN")}
                    </p>

                    {/* Edit and Delete Buttons */}
                    <div className="flex gap-3 mt-6">

                      <button
                        type="button"
                        onClick={() => handleEdit(internship)}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(internship._id)}
                        disabled={deletingId === internship._id}
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400"
                      >
                        {deletingId === internship._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>
                  </>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyInternships;
