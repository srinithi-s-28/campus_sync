import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Ensure public directory exists
const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log("Created /public directory for multer temp storage");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/**
 * Upload file to Cloudinary from file path
 * @param {string} filePath - Path to the file to upload
 * @returns {Promise<string>} - Returns secure_url of uploaded file
 * @throws {Error} - Throws error if upload fails
 */
const uploadOnCloudinary = async (filePath) => {
  try {
    console.log("[UPLOAD] Starting upload for:", filePath);
    
    if (!filePath) {
      throw new Error("File path is required");
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    console.log("[UPLOAD] File validated, uploading to Cloudinary...");
    
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    console.log("[UPLOAD] Success! URL:", uploadResult.secure_url);

    // Delete temp file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("[UPLOAD] Temp file deleted:", filePath);
    }

    return uploadResult.secure_url;
  } catch (error) {
    console.error("[UPLOAD] Cloudinary upload error:", error.message);
    // Delete temp file even on error
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("[UPLOAD] Temp file deleted on error:", filePath);
      }
    } catch (deleteError) {
      console.error("[UPLOAD] Error deleting temp file:", deleteError.message);
    }
    throw error;
  }
};

export default uploadOnCloudinary;
export { cloudinary };