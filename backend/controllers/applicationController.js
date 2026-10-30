
import Application from "../models/Application.js";
import Internship from "../models/Internship.js";
import User from "../models/User.js";
import path from "path";
import fs from "fs";

// Apply for Internship
export const applyInternship = async (req, res, next) => {
    try {
        const { coverLetter } = req.body;

        const internship = await Internship.findById(
            req.params.internshipId
        );

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found"
            });
        }

        if (internship.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "This internship is closed"
            });
        }

        const student = await User.findById(req.user._id);

        if (!student || student.role !== "student") {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const existingApplication = await Application.findOne({
            student: student._id,
            internship: internship._id
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this internship"
            });
        }

        const application = await Application.create({
            student: student._id,
            internship: internship._id,
            company: internship.company,
            resume: student.studentProfile?.resume || "",
            coverLetter: coverLetter || ""
        });

        res.status(201).json({
            success: true,
            message: "Internship application submitted successfully",
            application
        });

    } catch (error) {
        next(error);
    }
};


// Student View My Applications
export const getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({
            student: req.user._id
        })
            .populate("internship")
            .populate("company", "name companyProfile.companyName")
            .sort({ appliedAt: -1 });

        res.status(200).json({
            success: true,
            total: applications.length,
            applications
        });

    } catch (error) {
        next(error);
    }
};


// Company View Received Applications
export const getCompanyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({
            company: req.user._id
        })
            .populate(
                "student",
                "name email profileImage studentProfile"
            )
            .populate(
                "internship",
                "title category stipend location workMode"
            )
            .sort({ appliedAt: -1 });

        res.status(200).json({
            success: true,
            total: applications.length,
            applications
        });

    } catch (error) {
        next(error);
    }
};


// Company Update Application Status
export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const allowedStatus = [
            "reviewed",
            "shortlisted",
            "accepted",
            "rejected"
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application status"
            });
        }

        const application = await Application.findOne({
            _id: req.params.applicationId,
            company: req.user._id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        application.status = status;

        await application.save();

        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            application
        });

    } catch (error) {
        next(error);
    }
};


// Student View Application Status
export const getMyApplicationStatus = async (req, res, next) => {
    try {
        const applications = await Application.find({
            student: req.user._id
        })
            .populate("internship", "title category stipend")
            .populate("company", "name companyProfile.companyName")
            .select("status appliedAt internship company")
            .sort({ appliedAt: -1 });

        res.status(200).json({
            success: true,
            total: applications.length,
            applications
        });

    } catch (error) {
        next(error);
    }
};


// Company Download Student Resume
export const downloadApplicationResume = async (req, res, next) => {
    try {
        const application = await Application.findOne({
            _id: req.params.applicationId,
            company: req.user._id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        if (!application.resume) {
            return res.status(404).json({
                success: false,
                message: "Student resume not found"
            });
        }

        const filename = path.basename(application.resume);

        const resumePath = path.join(
            process.cwd(),
            "uploads",
            "resumes",
            filename
        );

        if (!fs.existsSync(resumePath)) {
            return res.status(404).json({
                success: false,
                message: "Resume file not found"
            });
        }

        return res.download(resumePath);

    } catch (error) {
        next(error);
    }
};
