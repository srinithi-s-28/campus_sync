import express from "express"
import { createMarketplaceItem, getAllMarketplaceItems, getMarketplaceItemById, deleteMarketplaceItem, updateMarketplaceItem } from "../controllers/MarketPlace.js"
import { isAuth } from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"

const router = express.Router()

// Get all marketplace items
router.get("/", getAllMarketplaceItems)

// Get single marketplace item
router.get("/:id", getMarketplaceItemById)

// Create marketplace item
router.post("/create", isAuth, upload.array("images", 5), createMarketplaceItem)

// Delete marketplace item
router.delete("/:id", isAuth, deleteMarketplaceItem)

// Update marketplace item
router.put("/:id", isAuth, upload.array("images", 5), updateMarketplaceItem)

export default router