
import express from "express";

import {
    getCompanyProfile,
    updateCompanyProfile
} from "../controllers/companyController.js";

import {
    protect,
    authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/profile",
    protect,
    authorize("company"),
    getCompanyProfile
);

router.put(
    "/profile",
    protect,
    authorize("company"),
    updateCompanyProfile
);

export default router;
