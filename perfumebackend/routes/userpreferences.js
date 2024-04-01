const UserPreferences = require("../models/Userpreferences");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

router.post("/", verifyToken, async (req, res) => {
  const userp = new UserPreferences(req.body);

  try {
    const savedUserPreferences = await userp.save();
    res.status(200).json(savedUserPreferences);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const userpreferences = await UserPreferences.find({ userId }).populate(
      "userId"
    );

    if (!userpreferences) {
      throw new Error("no userpreference found");
    }
    res.status(200).json(userpreferences);
  } catch (err) {
    console.error("Error fetching userpreferences:", err);
    res.status(500).json({ error: "Unable to fetch userreview" });
  }
});

// router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const perfume = await Perfume.findById(req.params.id);
//     res.status(200).json(perfume);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     await Perfume.findByIdAndDelete(req.params.id);
//     res.status(200).json("Perfume has been deleted...");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// router.get("/", async (req, res) => {
//   try {
//     const perfumes = await Perfume.find();

//     res.status(200).json(perfumes);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const updatedProduct = await Perfume.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedProduct);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
