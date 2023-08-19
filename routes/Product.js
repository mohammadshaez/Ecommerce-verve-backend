const { verifyAndAdmin, verifyAndAuthenticate } = require("../middlewares/verifyToken");
const Product = require("../models/Product");

const router = require("express").Router();

//Create Product
router.post("/create", verifyAndAdmin, async (req, res) => {
    const {title, desc, image, categories, size, color, price} = req.body;
    try{ 
        if(!title){
            return res.status(400).json("Title is required");
        }
        if(!desc){
            return res.status(400).json("Description is required");
        } 
        if(!image){
            return res.status(400).json("image is required");
        }
        if(!categories){
            return res.status(400).json("categories is required");
        }
        if(!size){
            return res.status(400).json("size is required");
        }
        if(!color){
            return res.status(400).json("color is required");
        }
        if(!price){
            return res.status(400).json("price is required");
        }
        const newProduct = {title, desc, image, categories, size, color, price};
        const product = new Product(newProduct);
        const savedProduct = await product.save();
        res.status(200).json(savedProduct);
    } catch(err) {
        res.status(500).json(err)
    }
})

// Get product

router.get("/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if(!product){
          return res.status(404).json("No product found by the given Id.");
      } 
      res.json(product);
    } catch (err) {
      res.status(401).json(err);
    }
  });
  
  // Get all product
  router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategories = req.query.categories;
    let product;
    try {
        if(qNew) {
            product = await Product.find().sort({createdAt: -1}).limit(1);
        } else if(qCategories) {
            product = await Product.find({
                categories : {
                    $in: [qCategories],
                }
            })
        } else {
            product = await Product.find();
        }
      if(!product){
        return res.status(404).json("No product found by the given Id.");
    } 
      res.json(product);
    } catch (err) {
      res.status(401).json(err);
    }
  });
  
  // Update user
  
  router.put("/update/:id", verifyAndAuthenticate, async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(201).json(updatedProduct);
    } catch (err) {
        console.log(err)
      res.status(401).json({err});
    }
  });
  
  router.delete("/delete/:id", verifyAndAdmin, async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.status(201).json("Product has been successfully deleted.");
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;
