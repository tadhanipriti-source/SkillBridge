
import User from "../models/User.js";

// GET STUDENT PROFILE
export const getStudentProfile = async (req, res, next) => {
    try {
        const student = await User.findById(req.user._id)
            .select("-password");

        if (!student || student.role !== "student") {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student profile fetched successfully",
            user: student
        });

    } catch (error) {
        next(error);
    }
};


// UPDATE STUDENT PROFILE
export const updateStudentProfile = async (req, res, next) => {
    try {
        const {
            name,
            phone,
            education,
            college,
            skills,
            location,
            bio
        } = req.body;

        const student = await User.findById(req.user._id);

        if (!student || student.role !== "student") {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Update basic details
        if (name !== undefined) {
            student.name = name;
        }

        // Update student details
        if (phone !== undefined)
            student.studentProfile.phone = phone;

        if (education !== undefined)
            student.studentProfile.education = education;

        if (college !== undefined)
            student.studentProfile.college = college;

        if (skills !== undefined) {
            if (!Array.isArray(skills)) {
                return res.status(400).json({
                    success: false,
                    message: "Skills must be an array"
                });
            }

            student.studentProfile.skills = skills;
        }

        if (location !== undefined)
            student.studentProfile.location = location;

        if (bio !== undefined)
            student.studentProfile.bio = bio;

        await student.save();

        res.status(200).json({
            success: true,
            message: "Student profile updated successfully",
            user: {
                id: student._id,
                name: student.name,
                email: student.email,
                role: student.role,
                studentProfile: student.studentProfile
            }
        });

    } catch (error) {
        next(error);
    }
};
