const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    rating: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    perfumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Perfume",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
