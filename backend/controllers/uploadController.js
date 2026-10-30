
import User from "../models/User.js";
import path from "path";
import fs from "fs";

// Upload Profile Image
export const uploadStudentImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select a profile image"
            });
        }

        const student = await User.findById(req.user._id);

        if (!student || student.role !== "student") {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        student.profileImage =
            `/uploads/profile/${req.file.filename}`;

        await student.save();

        res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            profileImage: student.profileImage
        });

    } catch (error) {
        next(error);
    }
};


// Upload Resume PDF
export const uploadStudentResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select a resume PDF"
            });
        }

        const student = await User.findById(req.user._id);

        if (!student || student.role !== "student") {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        student.studentProfile ??= {};

        student.studentProfile.resume =
            `/uploads/resumes/${req.file.filename}`;

        await student.save();

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resume: student.studentProfile.resume
        });

    } catch (error) {
        next(error);
    }
};


// Download Resume PDF
export const downloadStudentResume = async (req, res) => {
    try {
        const student = await User.findById(req.user._id);

        if (
            !student ||
            student.role !== "student" ||
            !student.studentProfile?.resume
        ) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        const filename = path.basename(
            student.studentProfile.resume
        );

        const resumePath = path.resolve(
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

        res.setHeader("Content-Type", "application/pdf");

        return res.download(
            resumePath,
            "My-Resume.pdf",
            (error) => {
                if (error) {
                    console.log("Download Error:", error.message);
                }
            }
        );

    } catch (error) {
        console.log("Resume Error:", error.message);

        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "Unable to download resume"
            });
        }
    }
};
