const Perfume = require("../models/Perfume");
const Order = require("../models/Order");
const UserPreferences = require("../models/Userpreferences");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newPerfume = new Perfume(req.body);

  try {
    const savedPerfume = await newPerfume.save();
    res.status(200).json(savedPerfume);
  } catch (err) {
    res.status(500).json(err);
  }
});




router.get("/purchased/:id", async (req, res) => {
  const userId = req.params.id;

  try {
      // Find orders of the user
      const orders = await Order.find({ userId });

      if (!orders || orders.length === 0) {
          return res.status(404).json({ message: 'No orders found for this user.' });
      }

      let perfumesAll = [];

      for (const order of orders) {
          for (const orderItem of order.orderItems) {
              // Find the perfume details using the id from orderItem
              const perfume = await Perfume.findById(orderItem.id);
              if (perfume) {
                  perfumesAll.push(perfume);
              }
          }
      }

      res.status(200).json(perfumesAll);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
});







router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.id);
    res.status(200).json(perfume);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Perfume.findByIdAndDelete(req.params.id);
    res.status(200).json("Perfume has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const perfumes = await Perfume.find();

    res.status(200).json(perfumes);
  } catch (err) {
    res.status(500).json(err);
  }
});

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

router.get("/recommend/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    // Fetch user preferences from the database
    const userPreferences = await UserPreferences.find({ userId: userId });

    console.log("User Preferences:", userPreferences);

    // Analyze user preferences to identify patterns
    let brandCount = {};
    let scentFamilyCount = {};
    let typeofCount = {};

    userPreferences.forEach((pref) => {
      // Counting brand preferences
      if (pref.brandname in brandCount) {
        brandCount[pref.brandname]++;
      } else {
        brandCount[pref.brandname] = 1;
      }

      // Counting scent family preferences
      pref.scentfamily.forEach((scent) => {
        if (scent in scentFamilyCount) {
          scentFamilyCount[scent]++;
        } else {
          scentFamilyCount[scent] = 1;
        }
      });

      // Counting typeof preferences
      if (pref.typeof in typeofCount) {
        typeofCount[pref.typeof]++;
      } else {
        typeofCount[pref.typeof] = 1;
      }
    });

    console.log("Brand Count:", brandCount);
    console.log("Scent Family Count:", scentFamilyCount);
    console.log("Typeof Count:", typeofCount);

    // Find the most purchased brand
    const mostPurchasedBrand = Object.keys(brandCount).reduce(
      (a, b) => (brandCount[a] > brandCount[b] ? a : b),
      ""
    );

    // Find the second most purchased brand
    let secondMostPurchasedBrand = "";
    if (Object.keys(brandCount).length > 1) {
      delete brandCount[mostPurchasedBrand];
      secondMostPurchasedBrand = Object.keys(brandCount).reduce(
        (a, b) => (brandCount[a] > brandCount[b] ? a : b),
        ""
      );
    }

    // Find the most preferred scent family
    const mostPreferredScentFamily = Object.keys(scentFamilyCount).reduce(
      (a, b) => (scentFamilyCount[a] > scentFamilyCount[b] ? a : b),
      ""
    );

    // Find the second most preferred scent family
    let secondMostPreferredScentFamily = "";
    if (Object.keys(scentFamilyCount).length > 1) {
      delete scentFamilyCount[mostPreferredScentFamily];
      secondMostPreferredScentFamily = Object.keys(scentFamilyCount).reduce(
        (a, b) => (scentFamilyCount[a] > scentFamilyCount[b] ? a : b),
        ""
      );
    }

    // Find the most frequent typeof preference
    const mostFrequentTypeof = Object.keys(typeofCount).reduce(
      (a, b) => (typeofCount[a] > typeofCount[b] ? a : b),
      ""
    );

    // Find the second most frequent typeof preference
    let secondMostFrequentTypeof = "";
    if (Object.keys(typeofCount).length > 1) {
      delete typeofCount[mostFrequentTypeof];
      secondMostFrequentTypeof = Object.keys(typeofCount).reduce(
        (a, b) => (typeofCount[a] > typeofCount[b] ? a : b),
        ""
      );
    }

    console.log("Most Purchased Brand:", mostPurchasedBrand);
    console.log("Second Most Purchased Brand:", secondMostPurchasedBrand);
    console.log("Most Preferred Scent Family:", mostPreferredScentFamily);
    console.log(
      "Second Most Preferred Scent Family:",
      secondMostPreferredScentFamily
    );
    console.log("Most Frequent Typeof:", mostFrequentTypeof);
    console.log("Second Most Frequent Typeof:", secondMostFrequentTypeof);

    const userOrders = await Order.find({ userId: userId });

    const orderedPerfumeIds = userOrders.flatMap((order) =>
      order.orderItems.map((orderItem) => orderItem.id)
    );

    const recommendedPerfumes = await Perfume.find({
      $or: [
        { brandname: mostPurchasedBrand },
        { brandname: secondMostPurchasedBrand },
      ],

      $or: [
        { typeof: mostFrequentTypeof },
        { typeof: secondMostFrequentTypeof },
      ],
      $or: [
        { brandname: mostPurchasedBrand },
        { brandname: secondMostPurchasedBrand },
      ],
      _id: { $nin: orderedPerfumeIds },
    });

    let recommendation = {
      recommendation:
        "You might like a new perfume from a similar brand or scent family.",
    };

    if (
      mostPurchasedBrand !== "" &&
      mostPreferredScentFamily !== "" &&
      mostFrequentTypeof !== ""
    ) {
      recommendation = {
        mostPurchasedBrand,
        secondMostPurchasedBrand,
        mostPreferredScentFamily,
        secondMostPreferredScentFamily,
        mostFrequentTypeof,
        secondMostFrequentTypeof,
        recommendation:
          "You might like a new perfume from a similar brand or scent family.",
      };
    } else if (
      mostPurchasedBrand === "" &&
      mostPreferredScentFamily === "" &&
      mostFrequentTypeof === ""
    ) {
      recommendation = {
        recommendation:
          "We couldn't find enough data to make a specific recommendation. You might explore different brands, scent families, and types.",
      };
    } else if (mostPurchasedBrand === "") {
      recommendation = {
        mostPreferredScentFamily,
        secondMostPreferredScentFamily,
        mostFrequentTypeof,
        secondMostFrequentTypeof,
        recommendation:
          "You might like a new perfume from a similar scent family.",
      };
    } else if (mostPreferredScentFamily === "") {
      recommendation = {
        mostPurchasedBrand,
        secondMostPurchasedBrand,
        mostFrequentTypeof,
        secondMostFrequentTypeof,
        recommendation: "You might like a new perfume from a similar brand.",
      };
    } else if (mostFrequentTypeof === "") {
      recommendation = {
        mostPurchasedBrand,
        secondMostPurchasedBrand,
        mostPreferredScentFamily,
        secondMostPreferredScentFamily,
        recommendation: "You might like a new perfume with a similar type.",
      };
    }

    res.status(200).json(recommendedPerfumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
