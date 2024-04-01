const Order = require("../models/Order");
const UserPreferences = require("../models/Userpreferences");
const { verifyToken } = require("./verifyToken");

const router = require("express").Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    for (const orderItem of req.body.orderItems) {
      const newUserPreferences = new UserPreferences({
        userId: req.body.userId,
        typeof: orderItem.typeof,
        feellike: orderItem.feellike,
        brandname: orderItem.brandname,
        scentfamily: orderItem.scentfamily,
      });

      const savedPreferences = await newUserPreferences.save();
    }

    res.status(200).json(savedOrder);
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

module.exports = router;
