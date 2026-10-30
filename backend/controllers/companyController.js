
import User from "../models/User.js";

// Get Company Profile
export const getCompanyProfile = async (req, res, next) => {
    try {
        const company = await User.findById(req.user._id)
            .select("-password");

        if (!company || company.role !== "company") {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Company profile fetched successfully",
            company
        });

    } catch (error) {
        next(error);
    }
};


// Update Company Profile
export const updateCompanyProfile = async (req, res, next) => {
    try {
        const company = await User.findById(req.user._id);

        if (!company || company.role !== "company") {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        const {
            name,
            companyName,
            website,
            description,
            location
        } = req.body;

        if (name !== undefined) company.name = name;

        company.companyProfile ??= {};

        if (companyName !== undefined)
            company.companyProfile.companyName = companyName;

        if (website !== undefined)
            company.companyProfile.website = website;

        if (description !== undefined)
            company.companyProfile.description = description;

        if (location !== undefined)
            company.companyProfile.location = location;

        await company.save();

        res.status(200).json({
            success: true,
            message: "Company profile updated successfully",
            company
        });

    } catch (error) {
        next(error);
    }
};
