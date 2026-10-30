
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        internship: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Internship",
            required: true
        },

        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        resume: {
            type: String,
            required: true
        },

        coverLetter: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "pending",
                "reviewed",
                "shortlisted",
                "accepted",
                "rejected"
            ],
            default: "pending"
        },

        appliedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// One student cannot apply twice for same internship
applicationSchema.index(
    { student: 1, internship: 1 },
    { unique: true }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

export default Application;
