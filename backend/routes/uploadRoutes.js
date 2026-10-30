
import express from "express";

import { protect, authorize } from "../middleware/authMiddleware.js";

import {
    uploadProfileImage,
    uploadResume
} from "../middleware/uploadMiddleware.js";

import {
    uploadStudentImage,
    uploadStudentResume,
    downloadStudentResume
} from "../controllers/uploadController.js";

const router = express.Router();

// Upload Profile Photo
router.post(
    "/profile-image",
    protect,
    authorize("student"),
    uploadProfileImage,
    uploadStudentImage
);

// Upload Resume
router.post(
    "/resume",
    protect,
    authorize("student"),
    uploadResume,
    uploadStudentResume
);

// Download Resume
router.get(
    "/resume",
    protect,
    authorize("student"),
    downloadStudentResume
);

export default router;
