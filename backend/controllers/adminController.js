
import User from "../models/User.js";
import Internship from "../models/Internship.js";
import Application from "../models/Application.js";

// 1. Get All Users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            total: users.length,
            users
        });
    } catch (error) {
        next(error);
    }
};

// 2. Get Single User
export const getSingleUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// 3. Update User Status
export const updateUserStatus = async (req, res, next) => {
    try {
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User status updated successfully",
            user
        });
    } catch (error) {
        next(error);
    }
};

// 4. Delete User
export const deleteUser = async (req, res, next) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Admin cannot delete their own account"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

// 5. Approve or Reject Company
export const updateCompanyApproval = async (req, res, next) => {
    try {
        const { isApproved } = req.body;

        if (typeof isApproved !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isApproved must be true or false"
            });
        }

        const company = await User.findOne({
            _id: req.params.id,
            role: "company"
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        company.companyProfile ??= {};
        company.companyProfile.isApproved = isApproved;

        await company.save();

        res.status(200).json({
            success: true,
            message: isApproved
                ? "Company approved successfully"
                : "Company rejected successfully",
            company
        });
    } catch (error) {
        next(error);
    }
};

// 6. Get All Companies
export const getAllCompanies = async (req, res, next) => {
    try {
        const companies = await User.find({
            role: "company"
        }).select("-password");

        res.status(200).json({
            success: true,
            total: companies.length,
            companies
        });
    } catch (error) {
        next(error);
    }
};

// 7. Get Pending Companies
export const getPendingCompanies = async (req, res, next) => {
    try {
        const companies = await User.find({
            role: "company",
            "companyProfile.isApproved": false
        }).select("-password");

        res.status(200).json({
            success: true,
            total: companies.length,
            companies
        });
    } catch (error) {
        next(error);
    }
};

// 8. Dashboard Statistics
export const getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalCompanies = await User.countDocuments({ role: "company" });

        const approvedCompanies = await User.countDocuments({
            role: "company",
            "companyProfile.isApproved": true
        });

        const pendingCompanies = await User.countDocuments({
            role: "company",
            "companyProfile.isApproved": false
        });

        const totalInternships = await Internship.countDocuments();
        const totalApplications = await Application.countDocuments();

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalStudents,
                totalCompanies,
                approvedCompanies,
                pendingCompanies,
                totalInternships,
                totalApplications
            }
        });
    } catch (error) {
        next(error);
    }
};

// 9. Get All Applications
export const getAllApplications = async (req, res, next) => {
    try {
        const applications = await Application.find()
            .populate("student", "name email")
            .populate("company", "name email companyProfile")
            .populate("internship", "title");

        res.status(200).json({
            success: true,
            total: applications.length,
            applications
        });
    } catch (error) {
        next(error);
    }
};

// 10. Get Single Application
export const getSingleApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate("student", "name email")
            .populate("company", "name email companyProfile")
            .populate("internship", "title");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.status(200).json({
            success: true,
            application
        });
    } catch (error) {
        next(error);
    }
};

// 11. Admin Update Application Status
export const adminUpdateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "reviewed",
            "shortlisted",
            "accepted",
            "rejected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application status"
            });
        }

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            application
        });
    } catch (error) {
        next(error);
    }
};

// 12. Delete Application
export const deleteApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        await application.deleteOne();

        res.status(200).json({
            success: true,
            message: "Application deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

// 13. Get All Internships
export const getAllAdminInternships = async (req, res, next) => {
    try {
        const internships = await Internship.find()
            .populate("company", "name email companyProfile");

        res.status(200).json({
            success: true,
            total: internships.length,
            internships
        });
    } catch (error) {
        next(error);
    }
};

// 14. Get Single Internship
export const getSingleAdminInternship = async (req, res, next) => {
    try {
        const internship = await Internship.findById(req.params.id)
            .populate("company", "name email companyProfile");

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Internship details fetched successfully",
            internship
        });
    } catch (error) {
        next(error);
    }
};

// 15. Admin Update Internship
export const adminUpdateInternship = async (req, res, next) => {
    try {
        const {
            title,
            description,
            category,
            skills,
            location,
            workMode,
            duration,
            stipend,
            openings,
            deadline,
            status
        } = req.body;

        const allowedStatuses = ["active", "closed"];

        if (status !== undefined && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be active or closed"
            });
        }

        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found"
            });
        }

        const updates = {
            title,
            description,
            category,
            skills,
            location,
            workMode,
            duration,
            stipend,
            openings,
            deadline,
            status
        };

        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                internship[key] = value;
            }
        });

        await internship.save();

        res.status(200).json({
            success: true,
            message: "Internship updated successfully",
            internship
        });
    } catch (error) {
        next(error);
    }
};

// 16. Admin Delete Internship
export const adminDeleteInternship = async (req, res, next) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found"
            });
        }

        const applicationCount = await Application.countDocuments({
            internship: internship._id
        });

        if (applicationCount > 0) {
            internship.status = "closed";
            await internship.save();

            return res.status(200).json({
                success: true,
                message: "Internship has applications, so it was closed instead of deleted",
                applicationCount,
                internship
            });
        }

        await internship.deleteOne();

        res.status(200).json({
            success: true,
            message: "Internship deleted successfully",
            applicationCount: 0
        });
    } catch (error) {
        next(error);
    }
};

// 17. Get All Students
export const getAllStudents = async (req, res, next) => {
    try {
        const students = await User.find({
            role: "student"
        }).select("-password");

        res.status(200).json({
            success: true,
            total: students.length,
            students
        });
    } catch (error) {
        next(error);
    }
};

// 18. Get Single Student
export const getSingleStudent = async (req, res, next) => {
    try {
        const student = await User.findOne({
            _id: req.params.id,
            role: "student"
        }).select("-password");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student details fetched successfully",
            student
        });
    } catch (error) {
        next(error);
    }
};

// 19. Admin Update Student Profile
export const adminUpdateStudent = async (req, res, next) => {
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

        const student = await User.findOne({
            _id: req.params.id,
            role: "student"
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (
            skills !== undefined &&
            (!Array.isArray(skills) ||
                !skills.every(skill => typeof skill === "string"))
        ) {
            return res.status(400).json({
                success: false,
                message: "Skills must be an array of strings"
            });
        }

        student.studentProfile ??= {};

        if (name !== undefined) student.name = name;
        if (phone !== undefined) student.studentProfile.phone = phone;
        if (education !== undefined) student.studentProfile.education = education;
        if (college !== undefined) student.studentProfile.college = college;
        if (skills !== undefined) student.studentProfile.skills = skills;
        if (location !== undefined) student.studentProfile.location = location;
        if (bio !== undefined) student.studentProfile.bio = bio;

        await student.save();

        res.status(200).json({
            success: true,
            message: "Student profile updated successfully",
            student: {
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

// 20. Get Single Company
export const getSingleCompany = async (req, res, next) => {
    try {
        const company = await User.findOne({
            _id: req.params.id,
            role: "company"
        }).select("-password");

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Company details fetched successfully",
            company
        });
    } catch (error) {
        next(error);
    }
};

// 21. Admin Update Company Profile
export const adminUpdateCompany = async (req, res, next) => {
    try {
        const {
            name,
            companyName,
            website,
            description,
            location
        } = req.body;

        const company = await User.findOne({
            _id: req.params.id,
            role: "company"
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        company.companyProfile ??= {};

        if (name !== undefined) company.name = name;
        if (companyName !== undefined) {
            company.companyProfile.companyName = companyName;
        }
        if (website !== undefined) {
            company.companyProfile.website = website;
        }
        if (description !== undefined) {
            company.companyProfile.description = description;
        }
        if (location !== undefined) {
            company.companyProfile.location = location;
        }

        await company.save();

        res.status(200).json({
            success: true,
            message: "Company profile updated successfully",
            company: {
                id: company._id,
                name: company.name,
                email: company.email,
                role: company.role,
                companyProfile: company.companyProfile
            }
        });
    } catch (error) {
        next(error);
    }
};

// 22. Admin Delete Company
export const adminDeleteCompany = async (req, res, next) => {
    try {
        const company = await User.findOne({
            _id: req.params.id,
            role: "company"
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        const internshipCount = await Internship.countDocuments({
            company: company._id
        });

        const applicationCount = await Application.countDocuments({
            company: company._id
        });

        if (internshipCount > 0 || applicationCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Company cannot be deleted because related internships or applications exist",
                internshipCount,
                applicationCount
            });
        }

        await company.deleteOne();

        res.status(200).json({
            success: true,
            message: "Company deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
