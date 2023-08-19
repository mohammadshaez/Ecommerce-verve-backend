const {
    verifyAndAdmin,
    verifyAndAuthenticate,
  } = require("../middlewares/verifyToken");
  const Order = require("../models/Order");
  
  const router = require("express").Router();
  
  //Create Order
  router.post("/create", verifyAndAdmin, async (req, res) => {
    try {
      const newCart = req.body;
      const order = new Order(newCart);
      const savedOrder = await order.save();
      res.status(200).json(savedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // Get Order
  
  router.get("/find/:userId", async (req, res) => {
    try {
      const order = await Order.find({userId : req.params.userId});
      if (!order) {
        return res.status(404).json("No product found by the given Id.");
      }
      res.json(order);
    } catch (err) {
      console.log(err)
      res.status(401).json(err);
    }
  });
  
  // Get all Orders
  router.get("/", verifyAndAdmin, async (req, res) => {
    try {
      const order = await Order.find();
      res.json(order);
    } catch (err) {
      res.status(401).json(err);
    }
  });
  
  // Update order
  
  router.put("/update/:id", verifyAndAdmin, async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(201).json(updatedOrder);
    } catch (err) {
      console.log(err);
      res.status(401).json({ err });
    }
  });
  
  router.delete("/delete/:id", verifyAndAdmin, async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.status(201).json("Product has been successfully deleted.");
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;
  