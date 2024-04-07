const Review = require("../models/Review");
const Perfume = require("../models/Perfume");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

router.post("/", verifyToken, async (req, res) => {
  const newReview = new Review(req.body);

  try {
    const savedReview = await newReview.save();
    res.status(200).json(savedReview);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id",verifyToken, async (req, res) => {
  try {
    const perfumeId = req.params.id;
    const reviews = await Review.find({ perfumeId }).populate("userId");

    if (!reviews) {
      throw new Error("Review not found");
    }
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Unable to fetch reviews" });
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json("Review has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get("/", async (req, res) => {
//   try {
//     const perfumes = await Perfume.find();

//     res.status(200).json(perfumes);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Perfume.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
