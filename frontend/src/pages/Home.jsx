
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-gray-50">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">

        <div>
          <p className="text-blue-600 font-semibold mb-4">
            YOUR CAREER STARTS HERE
          </p>

          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Find Your Dream
            <span className="text-blue-600"> Internship </span>
            & Build Your Future
          </h1>

          <p className="text-gray-600 text-lg mt-6 leading-relaxed">
            SkillBridge connects students with companies and helps
            them discover internship and placement opportunities.
            Start your professional journey with us.
          </p>

          <div className="flex gap-4 mt-8">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="border border-blue-600 text-blue-600 px-7 py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right Side Card */}
        <div className="bg-blue-600 rounded-3xl p-10 text-white shadow-xl">

          <h2 className="text-3xl font-bold mb-6">
            Build Your Career With SkillBridge
          </h2>

          <div className="space-y-5">
            <div className="bg-white/10 p-5 rounded-xl">
              <h3 className="text-xl font-semibold">
                🎓 For Students
              </h3>
              <p className="text-blue-100 mt-2">
                Explore internships and gain real-world experience.
              </p>
            </div>

            <div className="bg-white/10 p-5 rounded-xl">
              <h3 className="text-xl font-semibold">
                🏢 For Companies
              </h3>
              <p className="text-blue-100 mt-2">
                Find talented students for your organization.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-bold text-center text-gray-900">
            Why Choose SkillBridge?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12">

            <div className="p-7 rounded-xl bg-gray-50 shadow-sm">
              <h3 className="text-xl font-bold text-blue-600">
                Internship Opportunities
              </h3>
              <p className="text-gray-600 mt-3">
                Discover opportunities that match your skills and interests.
              </p>
            </div>

            <div className="p-7 rounded-xl bg-gray-50 shadow-sm">
              <h3 className="text-xl font-bold text-blue-600">
                Easy Application
              </h3>
              <p className="text-gray-600 mt-3">
                Apply for internships and track your application status.
              </p>
            </div>

            <div className="p-7 rounded-xl bg-gray-50 shadow-sm">
              <h3 className="text-xl font-bold text-blue-600">
                Career Growth
              </h3>
              <p className="text-gray-600 mt-3">
                Build experience and take the next step in your career.
              </p>
            </div>

          </div>
        </div>

      </section>

    </div>
  );
}

export default Home;
