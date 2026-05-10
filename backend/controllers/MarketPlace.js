import MarketplaceItem from "../models/MarketplaceItem.js"
import uploadOnCloudinary from "../config/cloudinary.js"

export const createMarketplaceItem = async (req, res) => {
  try {
    const userId = req.userId

    const {
      title,
      description,
      price,
      category,
      condition,
      location,
    } = req.body

    if (!title || !description || !price || !category) {
      return res.status(400).json({
        message: "Please fill all required fields",
      })
    }

    let images = []

    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          const uploadedUrl = await uploadOnCloudinary(file.path);
          if (uploadedUrl) {
            images.push(uploadedUrl)
          }
        }
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        return res.status(400).json({ message: "Failed to upload images" });
      }
    }

    const item = await MarketplaceItem.create({
      title,
      description,
      price,
      category,
      condition,
      location,
      images,
      seller: userId,
    })

    return res.status(201).json({
      message: "Item listed successfully",
      item,
    })
  } catch (error) {
    console.error("Create marketplace item error:", error)
    return res.status(500).json({
      message: "Failed to create item",
    })
  }
}


/* ---------- GET ALL ITEMS ---------- */
export const getAllMarketplaceItems = async (req, res) => {
  try {
    const { category, status, search } = req.query

    let filter = { isActive: true }

    if (category && category !== "all") {
      filter.category = category
    }

    if (status && status !== "all") {
      filter.status = status
    }

    if (search) {
      filter.$text = { $search: search }
    }

    const items = await MarketplaceItem.find(filter)
      .populate("seller", "name email phone")
      .sort({ createdAt: -1 })
      .lean()

    return res.status(200).json({
      success: true,
      count: items.length,
      items,
    })
  } catch (error) {
    console.error("Get marketplace items error:", error)
    return res.status(500).json({
      message: "Failed to fetch items",
    })
  }
}


/* ---------- GET SINGLE ITEM ---------- */
export const getMarketplaceItemById = async (req, res) => {
  try {
    const { id } = req.params

    const item = await MarketplaceItem.findById(id)
      .populate("seller", "name email phone")
      .lean()

    if (!item || !item.isActive) {
      return res.status(404).json({
        message: "Item not found",
      })
    }

    const relatedItems = await MarketplaceItem.find({
      category: item.category,
      _id: { $ne: item._id },
      isActive: true,
      status: "available",
    })
      .populate("seller", "name email phone")
      .limit(4)
      .lean()

    return res.status(200).json({
      success: true,
      item,
      relatedItems,
    })
  } catch (error) {
    console.error("Get marketplace item error:", error)
    return res.status(500).json({
      message: "Failed to fetch item",
    })
  }
}


export const deleteMarketplaceItem = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const item = await MarketplaceItem.findById(id)
    if (!item) return res.status(404).json({ message: 'Item not found' })

    if (String(item.seller) !== String(userId)) {
      return res.status(403).json({ message: 'Not allowed' })
    }

    await MarketplaceItem.findByIdAndDelete(id)

    return res.status(200).json({ message: 'Item deleted' })
  } catch (error) {
    console.error('Delete marketplace item error:', error)
    return res.status(500).json({ message: 'Failed to delete item' })
  }
}


export const updateMarketplaceItem = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const item = await MarketplaceItem.findById(id)
    if (!item) return res.status(404).json({ message: 'Item not found' })

    if (String(item.seller) !== String(userId)) {
      return res.status(403).json({ message: 'Not allowed' })
    }

    const {
      title,
      description,
      price,
      category,
      condition,
      location,
      status,
      isActive,
    } = req.body

    if (typeof title === 'string') item.title = title.trim()
    if (typeof description === 'string') item.description = description.trim()
    if (price !== undefined) item.price = Number(price)
    if (typeof category === 'string') item.category = category
    if (typeof condition === 'string') item.condition = condition
    if (typeof location === 'string') item.location = location
    if (typeof status === 'string') item.status = status
    if (typeof isActive !== 'undefined') item.isActive = isActive

    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          const uploadedUrl = await uploadOnCloudinary(file.path);
          if (uploadedUrl) {
            item.images.push(uploadedUrl)
          }
        }
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        return res.status(400).json({ message: "Failed to upload images" });
      }
    }

    await item.save()

    return res.status(200).json({ message: 'Item updated', item })
  } catch (error) {
    console.error('Update marketplace item error:', error)
    return res.status(500).json({ message: 'Failed to update item' })
  }
}