
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false
        },

        role: {
            type: String,
            enum: ["student", "company", "admin"],
            default: "student"
        },

        profileImage: {
            type: String,
            default: ""
        },

        // Student Details
        studentProfile: {
            phone: String,
            education: String,
            college: String,
            skills: [String],
            resume: String,
            location: String,
            bio: String
        },

        // Company Details
        companyProfile: {
            companyName: String,
            companyLogo: String,
            website: String,
            description: String,
            location: String,
            isApproved: {
                type: Boolean,
                default: false
            }
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;
