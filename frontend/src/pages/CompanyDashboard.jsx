
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function CompanyDashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [downloadingId, setDownloadingId] = useState("");

  const getToken = () =>
    sessionStorage.getItem("token") ||
    localStorage.getItem("token");

  const fetchApplications = async () => {
    try {
      const token = getToken();

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await API.get(
        "/applications/company-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(response.data.applications || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);

      await API.put(
        `/applications/${applicationId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      await fetchApplications();
      alert("Application status updated successfully!");
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to update application status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const downloadResume = async (applicationId) => {
    try {
      setDownloadingId(applicationId);

      const response = await API.get(
        `/applications/${applicationId}/resume`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Student-Resume-${applicationId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      alert("Unable to download resume. Please try again.");
    } finally {
      setDownloadingId("");
    }
  };

  const totalApplications = applications.length;

  const shortlisted = applications.filter(
    (app) => app.status === "shortlisted"
  ).length;

  const totalInternships = [
    ...new Set(
      applications
        .map((app) => app.internship?._id)
        .filter(Boolean)
    ),
  ].length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Welcome Section */}
        <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold">
            Welcome, Company! 👋
          </h1>

          <p className="mt-3 text-blue-100">
            Manage internships, find talented students and review applications.
          </p>

          <button
            type="button"
            onClick={() => navigate("/post-internship")}
            className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50"
          >
            + Post New Internship
          </button>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-gray-500">
              Internships With Applications
            </h2>

            <p className="text-3xl font-bold text-blue-600 mt-3">
              {loading ? "..." : totalInternships}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-gray-500">
              Total Applications
            </h2>

            <p className="text-3xl font-bold text-green-600 mt-3">
              {loading ? "..." : totalApplications}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-gray-500">
              Shortlisted
            </h2>

            <p className="text-3xl font-bold text-purple-600 mt-3">
              {loading ? "..." : shortlisted}
            </p>
          </div>

        </div>

        {/* Received Applications */}
        <div className="bg-white p-8 rounded-xl shadow-sm mt-8">

          <h2 className="text-2xl font-bold text-gray-800">
            Received Applications
          </h2>

          {loading ? (
            <p className="mt-6">Loading applications...</p>
          ) : error ? (
            <p className="text-red-600 mt-6">{error}</p>
          ) : applications.length === 0 ? (
            <p className="text-gray-500 mt-6">
              No applications received yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mt-6">

              {applications.map((application) => (
                <div
                  key={application._id}
                  className="border border-gray-200 p-6 rounded-xl"
                >

                  <h3 className="text-xl font-bold text-blue-600">
                    {application.student?.name || "Student"}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    Email: {application.student?.email || "N/A"}
                  </p>

                  <p className="text-gray-700 mt-3">
                    Internship: {application.internship?.title || "N/A"}
                  </p>

                  <p className="text-gray-600 mt-2">
                    Applied Date:{" "}
                    {application.appliedAt
                      ? new Date(application.appliedAt).toLocaleDateString("en-IN")
                      : "N/A"}
                  </p>

                  <p className="mt-3">
                    Current Status:{" "}
                    <span className="font-semibold text-blue-600">
                      {application.status || "pending"}
                    </span>
                  </p>

                  <label className="block font-semibold text-gray-700 mt-5 mb-2">
                    Update Application Status
                  </label>

                  <select
                    value={application.status || "pending"}
                    disabled={updatingId === application._id}
                    onChange={(e) =>
                      updateStatus(application._id, e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-3"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => downloadResume(application._id)}
                    disabled={
                      downloadingId === application._id ||
                      !application.resume
                    }
                    className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {downloadingId === application._id
                      ? "Downloading..."
                      : application.resume
                        ? "Download Resume"
                        : "Resume Not Available"}
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;
