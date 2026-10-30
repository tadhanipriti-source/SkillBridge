
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PostInternship from "./pages/PostInternship";
import MyInternships from "./pages/MyInternships";

import StudentDashboard from "./pages/StudentDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Internships from "./pages/Internships";
import InternshipDetails from "./pages/InternshipDetails";
import MyApplications from "./pages/MyApplications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/profile" element={<Profile />} />

          <Route
            path="/post-internship"
            element={<PostInternship />}
          />

          <Route
            path="/my-internships"
            element={<MyInternships />}
          />

          <Route path="/internships" element={<Internships />} />
          <Route path="/internships/:id" element={<InternshipDetails />} />
          <Route path="/my-applications" element={<MyApplications />} />
        </Route>

        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/company-dashboard"
          element={<CompanyDashboard />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
