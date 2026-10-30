
import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Internship title is required"],
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        category: {
            type: String,
            required: true
        },

        skills: {
            type: [String],
            default: []
        },

        location: {
            type: String,
            required: true
        },

        workMode: {
            type: String,
            enum: ["remote", "onsite", "hybrid"],
            default: "onsite"
        },

        duration: {
            type: String,
            required: true
        },

        stipend: {
            type: Number,
            default: 0,
            min: 0
        },

        openings: {
            type: Number,
            default: 1,
            min: 1
        },

        deadline: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["active", "closed"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

internshipSchema.index({
    title: "text",
    description: "text",
    skills: "text",
    category: "text"
});

const Internship = mongoose.model(
    "Internship",
    internshipSchema
);

export default Internship;
