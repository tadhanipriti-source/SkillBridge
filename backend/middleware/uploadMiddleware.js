
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// Create storage folders
const profileDir = path.join(process.cwd(), "uploads", "profile");
const resumeDir = path.join(process.cwd(), "uploads", "resumes");

fs.mkdirSync(profileDir, { recursive: true });
fs.mkdirSync(resumeDir, { recursive: true });

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "profileImage") {
            cb(null, profileDir);
        } else if (file.fieldname === "resume") {
            cb(null, resumeDir);
        } else {
            cb(new Error("Invalid file field"));
        }
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const filename = `${crypto.randomUUID()}${extension}`;

        cb(null, filename);
    }
});

// File validation
const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const allowedImages = [".jpg", ".jpeg", ".png", ".webp"];

    if (file.fieldname === "profileImage") {
        if (
            allowedImages.includes(extension) &&
            ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)
        ) {
            return cb(null, true);
        }

        return cb(new Error("Only JPG, PNG and WEBP images are allowed"));
    }

    if (file.fieldname === "resume") {
        if (
            extension === ".pdf" &&
            file.mimetype === "application/pdf"
        ) {
            return cb(null, true);
        }

        return cb(new Error("Only PDF resume files are allowed"));
    }

    cb(new Error("Invalid upload field"));
};

// Multer upload configuration
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

export const uploadProfileImage = upload.single("profileImage");
export const uploadResume = upload.single("resume");
