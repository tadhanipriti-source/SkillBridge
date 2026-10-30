
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/internships")
      .then((response) => {
        setInternships(response.data.internships || []);
      })
      .catch((error) => {
        console.log("API Error:", error);
        setError("Unable to load internships.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading internships...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">
          Explore Internships
        </h1>

        <p className="text-gray-600 mt-2">
          Find the right internship to start your career.
        </p>

        {internships.length === 0 ? (
          <p className="mt-10 text-gray-600">No internships available.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {internships.map((internship) => (
              <div
                key={internship._id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition"
              >
                <h2 className="text-xl font-bold text-blue-600">
                  {internship.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  {internship.company?.name}
                </p>

                <p className="text-gray-700 mt-4">
                  {internship.description}
                </p>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>📍 Location: {internship.location}</p>
                  <p>💼 Work Mode: {internship.workMode}</p>
                  <p>⏳ Duration: {internship.duration}</p>
                  <p>💰 Stipend: ₹{internship.stipend}/month</p>
                  <p>👥 Openings: {internship.openings}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {internship.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <button
                  className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                  onClick={() =>
                    navigate(`/internships/${internship._id}`)
                  }
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Internships;
