
import { useEffect, useState } from "react";
import API from "../api/axios";

function StudentDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token =
          sessionStorage.getItem("token") ||
          localStorage.getItem("token");

        if (!token) {
          setError("Please login again.");
          return;
        }

        const response = await API.get(
          "/applications/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setApplications(response.data.applications || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const shortlisted = applications.filter(
    (app) => app.status === "shortlisted"
  ).length;

  const accepted = applications.filter(
    (app) => app.status === "accepted"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold">
            Welcome, Student! 👋
          </h1>
          <p className="mt-3 text-blue-100">
            Track your internship applications and career progress.
          </p>
        </div>

        {error && (
          <p className="text-red-600 mt-5">{error}</p>
        )}

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-gray-500">Total Applications</h2>
            <p className="text-3xl font-bold text-blue-600 mt-3">
              {loading ? "..." : applications.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-gray-500">Shortlisted</h2>
            <p className="text-3xl font-bold text-green-600 mt-3">
              {loading ? "..." : shortlisted}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-gray-500">Accepted</h2>
            <p className="text-3xl font-bold text-purple-600 mt-3">
              {loading ? "..." : accepted}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm mt-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-2 gap-5 mt-6">
            <a
              href="/internships"
              className="bg-blue-50 p-6 rounded-xl hover:bg-blue-100"
            >
              <h3 className="text-lg font-bold text-blue-600">
                Browse Internships
              </h3>
              <p className="text-gray-600 mt-2">
                Find and apply for new internships.
              </p>
            </a>

            <a
              href="/my-applications"
              className="bg-green-50 p-6 rounded-xl hover:bg-green-100"
            >
              <h3 className="text-lg font-bold text-green-600">
                My Applications
              </h3>
              <p className="text-gray-600 mt-2">
                Check your application status.
              </p>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;
