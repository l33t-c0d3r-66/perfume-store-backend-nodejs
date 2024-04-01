const mongoose = require("mongoose");

const PerfumeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true, unique: true },
    price: { type: String, required: true },
    images: { type: String },
    typeof: { type: String, required: true },
    feellike: { type: String, required: true },
    brandname: { type: String, required: true },
    scentfamily: [{ type: String, required: true }],
    reviews: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
    quantity: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Perfume", PerfumeSchema);
