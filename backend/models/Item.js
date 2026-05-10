import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
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
      maxlength: 1000,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "electronics",
        "books",
        "clothing",
        "accessories",
        "documents",
        "keys",
        "wallet",
        "bag",
        "id_cards",
        "mobile",
        "laptop",
        "pets",
        "jewelry",
        "vehicles",
        "other",
      ],
      index: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["lost", "found"],
      index: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["active", "claimed", "resolved", "expired"],
      default: "active",
      index: true,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    expiryDate: {
      type: Date,
      default: () =>
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      index: true,
    },
  },
  { timestamps: true }
);

//
// ✅ TEXT SEARCH INDEX (only existing fields)
//
ItemSchema.index({
  title: "text",
  description: "text",
  location: "text",
});

//
// ✅ COMPOUND FILTER INDEX
//
ItemSchema.index({ category: 1, type: 1, status: 1 });

//
// ✅ AUTO EXPIRE → optional (if you want Mongo TTL)
// Uncomment if needed
//
// ItemSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

const Item =
  mongoose.models.Item || mongoose.model("Item", ItemSchema);

export default Item;
