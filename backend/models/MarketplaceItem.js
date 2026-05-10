import mongoose from "mongoose"

const MarketplaceItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "books",
        "electronics",
        "accessories",
        "clothing",
        "stationery",
        "furniture",
        "other",
      ],
      index: true,
    },

    condition: {
      type: String,
      enum: ["new", "like_new", "good", "fair"],
      default: "good",
    },

    images: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["available", "sold", "reserved"],
      default: "available",
      index: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
)

/* ---------- TEXT SEARCH ---------- */
MarketplaceItemSchema.index({
  title: "text",
  description: "text",
})

/* ---------- COMPOUND FILTER ---------- */
MarketplaceItemSchema.index({
  category: 1,
  status: 1,
  createdAt: -1,
})

const MarketplaceItem =
  mongoose.models.MarketplaceItem ||
  mongoose.model("MarketplaceItem", MarketplaceItemSchema)

export default MarketplaceItem
