
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// REGISTER API
export const registerUser = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            role,
            studentProfile,
            companyProfile
        } = req.body;

        // Check required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled"
            });
        }

        // Public registration only for student and company
        if (!["student", "company"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid registration role"
            });
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
            ...(role === "student" && { studentProfile }),
            ...(role === "company" && { companyProfile })
        });

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};


// LOGIN API
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user and include hidden password
        const user = await User.findOne({
            email: email.toLowerCase()
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive"
            });
        }

        // Generate JWT
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};


// GET LOGGED-IN USER
export const getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
};
