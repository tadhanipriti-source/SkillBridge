
function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold">
            Welcome, Admin! 👋
          </h1>
          <p className="mt-3 text-gray-300">
            Manage students, companies, internships and applications.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-gray-500">Total Students</h2>
            <p className="text-3xl font-bold text-blue-600 mt-3">0</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-gray-500">Total Companies</h2>
            <p className="text-3xl font-bold text-green-600 mt-3">0</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-gray-500">Internships</h2>
            <p className="text-3xl font-bold text-purple-600 mt-3">0</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-gray-500">Applications</h2>
            <p className="text-3xl font-bold text-orange-600 mt-3">0</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm mt-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Admin Management
          </h2>

          <div className="grid md:grid-cols-3 gap-5 mt-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="font-bold text-blue-600">👨‍🎓 Manage Students</h3>
              <p className="text-gray-600 mt-2">View and manage student accounts.</p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="font-bold text-green-600">🏢 Manage Companies</h3>
              <p className="text-gray-600 mt-2">Review and approve companies.</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="font-bold text-purple-600">💼 Manage Internships</h3>
              <p className="text-gray-600 mt-2">View and manage internship posts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
