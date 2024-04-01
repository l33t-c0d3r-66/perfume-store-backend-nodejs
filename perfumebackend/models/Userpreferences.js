const mongoose = require("mongoose");

const UserPreferences = new mongoose.Schema(
  {
    typeof: { type: String, required: true },
    feellike: { type: String, required: true },
    brandname: { type: String},
    scentfamily: [{ type: String, required: true }],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPreferences", UserPreferences);
