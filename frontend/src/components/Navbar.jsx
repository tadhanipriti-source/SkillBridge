
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-sm px-6 py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold text-blue-600">
          SkillBridge
        </Link>

        <div className="flex gap-6 items-center">

          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>

          <Link to="/login" className="text-gray-700 hover:text-blue-600">
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Register
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
