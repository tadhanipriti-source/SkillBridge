
import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import {
  notFound,
  errorHandler
} from "./middleware/errorMiddleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files - Profile Images
app.use(
  "/uploads/profile",
  express.static(path.join(process.cwd(), "uploads/profile"))
);

// Static Files - Student Resumes
app.use(
  "/uploads/resumes",
  express.static(path.join(process.cwd(), "uploads/resumes"))
);

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to SkillBridge API"
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
