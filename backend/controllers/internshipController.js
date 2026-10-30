
import Internship from "../models/Internship.js";
import Application from "../models/Application.js";

// Create Internship
export const createInternship = async (req, res, next) => {
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
            deadline
        } = req.body;

        if (!title || !description || !category || !location || !duration || !deadline) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const internship = await Internship.create({
            title,
            description,
            category,
            skills: skills || [],
            location,
            workMode,
            duration,
            stipend,
            openings,
            deadline,
            company: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Internship created successfully",
            internship
        });

    } catch (error) {
        next(error);
    }
};


// Get All Active Internships
export const getAllInternships = async (req, res, next) => {
    try {
        const internships = await Internship.find({
            status: "active"
        })
            .populate(
                "company",
                "name companyProfile.companyName companyProfile.companyLogo"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: internships.length,
            internships
        });

    } catch (error) {
        next(error);
    }
};


// Get Single Internship
export const getSingleInternship = async (req, res, next) => {
    try {
        const internship = await Internship.findById(req.params.id)
            .populate(
                "company",
                "name companyProfile.companyName companyProfile.companyLogo"
            );

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


// Update Internship
export const updateInternship = async (req, res, next) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found"
            });
        }

        if (internship.company.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this internship"
            });
        }

        const allowedFields = [
            "title",
            "description",
            "category",
            "skills",
            "location",
            "workMode",
            "duration",
            "stipend",
            "openings",
            "deadline",
            "status"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                internship[field] = req.body[field];
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


// Delete Internship
export const deleteInternship = async (req, res, next) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found"
            });
        }

        if (internship.company.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this internship"
            });
        }

        const applicationCount = await Application.countDocuments({
            internship: internship._id
        });

        await Internship.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Internship deleted successfully",
            preservedApplications: applicationCount
        });

    } catch (error) {
        next(error);
    }
};


// Get Company's Own Internships
export const getCompanyInternships = async (req, res, next) => {
    try {
        const internships = await Internship.find({
            company: req.user._id
        })
            .populate(
                "company",
                "name companyProfile.companyName companyProfile.companyLogo"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: internships.length,
            internships
        });

    } catch (error) {
        next(error);
    }
};
