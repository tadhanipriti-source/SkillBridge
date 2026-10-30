
import { useEffect, useState } from "react";
import API from "../api/axios";

function MyApplications() {
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
        console.log("Application Error:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load your applications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-10">
        Loading applications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-10">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800">
          My Applications
        </h1>

        <p className="text-gray-600 mt-2">
          Track your internship application status.
        </p>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center mt-8">
            <h2 className="text-xl font-semibold text-gray-700">
              No Applications Yet
            </h2>

            <p className="text-gray-500 mt-2">
              You have not applied for any internships yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mt-8">

            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <h2 className="text-xl font-bold text-blue-600">
                  {application.internship?.title || "Internship"}
                </h2>

                <p className="text-gray-600 mt-2">
                  {application.company?.name ||
                    application.internship?.company?.name ||
                    "Company"}
                </p>

                <p className="text-gray-600 mt-4">
                  Applied Date:{" "}
                  {application.createdAt
                    ? new Date(
                        application.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </p>

                <p className="mt-4">
                  Status:{" "}
                  <span className="font-semibold text-blue-600">
                    {application.status || "Pending"}
                  </span>
                </p>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyApplications;
