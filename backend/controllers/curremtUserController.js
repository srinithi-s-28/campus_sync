import UserModel from "../models/User.Models.js";
import uploadOnCloudinary from "../config/cloudinary.js";

/**
 * Get current user profile
 * @route GET /api/user/profile
 * @access Private
 */
export const currentUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error while fetching user profile" 
    });
  }
};

/**
 * Update user profile (name, phone, and profile image)
 * @route PUT /api/user/profile
 * @access Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updateData = {};

    // Update name if provided
    if (name) {
      updateData.name = name.trim();
    }

    // Update phone if provided
    if (phone) {
      updateData.phone = phone.trim();
    }

    // Upload profile image to Cloudinary if provided
    if (req.file) {
      try {
        console.log("[UPDATE_PROFILE] File info:", { fieldname: req.file.fieldname, originalname: req.file.originalname, path: req.file.path, size: req.file.size });
        console.log("[UPDATE_PROFILE] Starting image upload...");
        const cloudinaryResult = await uploadOnCloudinary(req.file.path);
        updateData.ProfileImage = cloudinaryResult;
        console.log("[UPDATE_PROFILE] Image uploaded successfully:", cloudinaryResult);
      } catch (uploadError) {
        console.error("[UPDATE_PROFILE] Upload error:", uploadError.message);
        return res.status(400).json({
          success: false,
          message: "Failed to upload image to cloud storage",
          error: uploadError.message
        });
      }
    }

    // Update user in database
    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error while updating profile" 
    });
  }
};