require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");



// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "product_images",
    format: async (req, file) => "png", // Convert all images to PNG
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage });

// ✅ Add a New Product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = req.file.path;
    
    if (!req.body.category || !mongoose.Types.ObjectId.isValid(req.body.category)) {
      return res.status(400).json({ message: "Invalid category ID format" });
    }

    const productData = {
      name: req.body.name,
      price: Number(req.body.price),
      description: req.body.description,
      inStock: req.body.inStock === "true" || req.body.inStock === true,
      category: new mongoose.Types.ObjectId(req.body.category),
      image: imageUrl,
    };

    const product = new Product(productData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Update a Product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const updateData = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      inStock: req.body.inStock === "true",
      category: req.body.category,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get Products
router.get("/", async (req, res) => {
  try {
    let query = {};
    if (req.query.category) {
      if (!mongoose.Types.ObjectId.isValid(req.query.category)) {
        return res.status(400).json({ message: "Invalid category ID format" });
      }
      query.category = req.query.category;
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Delete a Product
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully", deletedProduct });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;