
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Check Login
export const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find user
        const user = await User.findById(decoded.id)
            .select("-password");

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: "User not found or inactive"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("JWT ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};


// Check User Role
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        next();
    };
};
