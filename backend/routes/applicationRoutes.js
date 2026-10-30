
import express from "express";

import {
    applyInternship,
    getMyApplications,
    getCompanyApplications,
    updateApplicationStatus,
    getMyApplicationStatus,
    downloadApplicationResume
} from "../controllers/applicationController.js";

import {
    protect,
    authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Student Apply for Internship
router.post(
    "/:internshipId",
    protect,
    authorize("student"),
    applyInternship
);

// Student View My Applications
router.get(
    "/my-applications",
    protect,
    authorize("student"),
    getMyApplications
);

// Student View Application Status
router.get(
    "/my-status",
    protect,
    authorize("student"),
    getMyApplicationStatus
);

// Company View Received Applications
router.get(
    "/company-applications",
    protect,
    authorize("company"),
    getCompanyApplications
);

// Company Update Application Status
router.put(
    "/:applicationId/status",
    protect,
    authorize("company"),
    updateApplicationStatus
);

// Company Download Student Resume
router.get(
    "/:applicationId/resume",
    protect,
    authorize("company"),
    downloadApplicationResume
);

export default router;
