const {
  verifyAndAdmin,
  verifyAndAuthenticate,
} = require("../middlewares/verifyToken");
const Cart = require("../models/Cart");

const router = require("express").Router();

//Create Cart
router.post("/create", verifyAndAdmin, async (req, res) => {
  try {
    const newCart = req.body;
    const cart = new Cart(newCart);
    const savedCart = await cart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Cart

router.get("/find/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({userId : req.params.userId});
    if (!cart) {
      return res.status(404).json("No product found by the given Id.");
    }
    res.json(cart);
  } catch (err) {
    console.log(err)
    res.status(401).json(err);
  }
});

// Get all Carts
router.get("/", verifyAndAdmin, async (req, res) => {
  try {
    const cart = await Cart.find();
    res.json(cart);
  } catch (err) {
    res.status(401).json(err);
  }
});

// Update cart

router.put("/update/:id", verifyAndAuthenticate, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(201).json(updatedCart);
  } catch (err) {
    console.log(err);
    res.status(401).json({ err });
  }
});

router.delete("/delete/:id", verifyAndAdmin, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(201).json("Product has been successfully deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
