
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [coverLetter, setCoverLetter] = useState(
    "Dear Hiring Manager, I am interested in applying for this internship. I have relevant technical knowledge and I am eager to learn new skills and work on real-world projects. Thank you for considering my application."
  );

  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    API.get(`/internships/${id}`)
      .then((response) => {
        setInternship(response.data.internship);
      })
      .catch((error) => {
        console.log("API Error:", error);
        setError("Unable to load internship details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleApply = async () => {
    setMessage("");

    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    if (!coverLetter.trim()) {
      setMessage("Please enter your cover letter.");
      return;
    }

    setApplying(true);

    try {
      const response = await API.post(
        `/applications/${id}`,
        {
          coverLetter: coverLetter,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
        "Application submitted successfully!"
      );

      setApplied(true);

    } catch (error) {
      console.log("Application Error:", error);

      setMessage(
        error.response?.data?.message ||
        "Unable to submit application. Please try again."
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-10">
        Loading...
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="text-center text-red-600 p-10">
        {error || "Internship not found."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">

        <Link
          to="/internships"
          className="text-blue-600 hover:underline"
        >
          ← Back to Internships
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mt-6">
          {internship.title}
        </h1>

        <p className="text-blue-600 font-semibold mt-2">
          {internship.company?.name}
        </p>

        <p className="text-gray-600 mt-6">
          {internship.description}
        </p>

        <div className="grid md:grid-cols-2 gap-5 mt-8">
          <p>📍 Location: {internship.location}</p>
          <p>💼 Work Mode: {internship.workMode}</p>
          <p>⏳ Duration: {internship.duration}</p>
          <p>💰 Stipend: ₹{internship.stipend}/month</p>
          <p>👥 Openings: {internship.openings}</p>
          <p>📂 Category: {internship.category}</p>
        </div>

        <h2 className="text-xl font-bold mt-8">
          Required Skills
        </h2>

        <div className="flex flex-wrap gap-2 mt-4">
          {internship.skills?.map((skill) => (
            <span
              key={skill}
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>

        <p className="mt-8 text-gray-600">
          Application Deadline:{" "}
          {internship.deadline
            ? new Date(internship.deadline).toLocaleDateString("en-IN")
            : "Not specified"}
        </p>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800">
            Cover Letter
          </h2>

          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows="5"
            disabled={applied}
            className="w-full border border-gray-300 rounded-lg p-4 mt-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Write your cover letter..."
          />
        </div>

        {message && (
          <p className="text-center mt-5 font-semibold text-blue-600">
            {message}
          </p>
        )}

        <button
          onClick={handleApply}
          disabled={applying || applied}
          className="w-full bg-blue-600 text-white py-3 rounded-lg mt-8 hover:bg-blue-700 disabled:bg-gray-400"
        >
          {applied
            ? "Application Submitted"
            : applying
            ? "Applying..."
            : "Apply Now"}
        </button>

      </div>
    </div>
  );
}

export default InternshipDetails;
