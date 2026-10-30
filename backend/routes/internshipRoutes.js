
import express from "express";

import {
    createInternship,
    getAllInternships,
    getSingleInternship,
    updateInternship,
    deleteInternship,
    getCompanyInternships
} from "../controllers/internshipController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllInternships);
router.get("/:id", getSingleInternship);

// Company Protected Routes
router.get(
    "/company/my-internships",
    protect,
    authorize("company"),
    getCompanyInternships
);

router.post("/", protect, authorize("company"), createInternship);
router.put("/:id", protect, authorize("company"), updateInternship);
router.delete("/:id", protect, authorize("company"), deleteInternship);

export default router;
