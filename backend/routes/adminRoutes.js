
import express from "express";

import {
    getAllUsers,
    getSingleUser,
    updateUserStatus,
    deleteUser,
    updateCompanyApproval,
    getAllCompanies,
    getPendingCompanies,
    getDashboardStats,
    getAllApplications,
    getSingleApplication,
    adminUpdateApplicationStatus,
    deleteApplication,
    getAllAdminInternships,
    getSingleAdminInternship,
    adminUpdateInternship,
    adminDeleteInternship,
    getAllStudents,
    getSingleStudent,
    adminUpdateStudent,
    getSingleCompany,
    adminUpdateCompany,
    adminDeleteCompany
} from "../controllers/adminController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// User APIs
router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/users/:id", protect, authorize("admin"), getSingleUser);
router.put("/users/:id/status", protect, authorize("admin"), updateUserStatus);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

// Student APIs
router.get("/students", protect, authorize("admin"), getAllStudents);
router.get("/students/:id", protect, authorize("admin"), getSingleStudent);
router.put("/students/:id", protect, authorize("admin"), adminUpdateStudent);

// Company APIs
router.get("/companies", protect, authorize("admin"), getAllCompanies);
router.get("/companies/pending", protect, authorize("admin"), getPendingCompanies);
router.get("/companies/:id", protect, authorize("admin"), getSingleCompany);
router.put("/companies/:id", protect, authorize("admin"), adminUpdateCompany);
router.put("/companies/:id/approval", protect, authorize("admin"), updateCompanyApproval);
router.delete("/companies/:id", protect, authorize("admin"), adminDeleteCompany);

// Dashboard API
router.get("/dashboard-stats", protect, authorize("admin"), getDashboardStats);

// Application APIs
router.get("/applications", protect, authorize("admin"), getAllApplications);
router.get("/applications/:id", protect, authorize("admin"), getSingleApplication);
router.put("/applications/:id/status", protect, authorize("admin"), adminUpdateApplicationStatus);
router.delete("/applications/:id", protect, authorize("admin"), deleteApplication);

// Internship APIs
router.get("/internships", protect, authorize("admin"), getAllAdminInternships);
router.get("/internships/:id", protect, authorize("admin"), getSingleAdminInternship);
router.put("/internships/:id", protect, authorize("admin"), adminUpdateInternship);
router.delete("/internships/:id", protect, authorize("admin"), adminDeleteInternship);

export default router;
