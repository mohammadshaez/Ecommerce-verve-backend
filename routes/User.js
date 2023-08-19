const router = require("express").Router();
const {
  verifyAndAuthenticate,
  verifyAndAdmin,
} = require("../middlewares/verifyToken");
const User = require("../models/User");
const CryptoJS = require("crypto-js");

// Get user

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    !user && res.status(404).json("No user found by the given Id.");
    res.json(user);
  } catch (err) {
    res.status(401).json(err);
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const user = await User.find({}).limit(5);
    !user && res.status(404).json("No user found by the given Id.");
    res.json(user);
  } catch (err) {
    res.status(401).json(err);
  }
});

// Update user

router.put("/update/:id", verifyAndAuthenticate, async (req, res) => {
  // to stop storing the plain pw directly
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(201).json(updatedUser);
  } catch (err) {
    res.status(401).json(err);
  }
});

router.delete("/delete/:id", verifyAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(201).json("User has been successfully deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
