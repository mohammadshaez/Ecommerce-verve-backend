const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
// Register
router.post("/register", async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.confirmedPassword,
      process.env.PASSWORD_SECRET
    ).toString(),
  });
  try {
    const newUser = await user.save();
    res.json({
      success: true,
      user: newUser,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    console.log(user)
    if (!user) {
      return res.status(401).json("Invalid username");
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== req.body.password)
      return res.status(401).json("Invalid Password");

    const tokenPayLoad = {
      id: user._id,
      isAdmin: user.isAdmin,
    };
    const token = jwt.sign(tokenPayLoad, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    
    const { password, ...otherDetails } = user._doc;
    await User.findByIdAndUpdate(user._id, { token: token });
    res.status(201).json({ ...otherDetails, token });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
