const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
    title : { type: String, required: true, unique: true},
    desc: {type: String, required: true},
    image: {type: String, required: true},
    categories: {type: Array, required: true},
    size: {type: Array},
    color: {type: Array},
    price: {type: Number, required: true},
    inStock: {type:Boolean, default: true},
}, { timestamps: true })

module.exports = mongoose.model("Products", ProductsSchema);