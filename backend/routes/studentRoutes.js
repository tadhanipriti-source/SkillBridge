
import express from "express";

import {
    getStudentProfile,
    updateStudentProfile
} from "../controllers/studentController.js";

import {
    protect,
    authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get Student Profile
router.get(
    "/profile",
    protect,
    authorize("student"),
    getStudentProfile
);

// Update Student Profile
router.put(
    "/profile",
    protect,
    authorize("student"),
    updateStudentProfile
);

export default router;
