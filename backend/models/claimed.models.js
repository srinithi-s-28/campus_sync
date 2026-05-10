import mongoose from "mongoose";

const ClaimedSchema = new mongoose.Schema(
	{
		item: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Item",
			required: true,
			index: true,
		},
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		claimant: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		// Form data from claimant
		identifyingDetails: {
			type: String,
			required: true,
			maxlength: 2000,
		},
		lostLocation: {
			type: String,
			trim: true,
			default: "",
		},
		lostDate: {
			type: Date,
		},
		itemImage: {
			type: String,
			default: "",
		},
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
			index: true,
		},
		score: {
			type: Number,
			min: 0,
			max: 100,
			default: null,
		},
		rejectReason: {
			type: String,
			default: "",
			trim: true,
			maxlength: 500,
		},
	},
	{ timestamps: true }
);

const ClaimedModel =
	mongoose.models.Claimed || mongoose.model("Claimed", ClaimedSchema);

export default ClaimedModel;
