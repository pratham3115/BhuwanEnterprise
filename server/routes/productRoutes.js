const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const Product = require("../models/product");
const router = express.Router();

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Define upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// ✅ **Add a New Product** (Fixed Category Validation)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file && !req.body.imageUrl) {
      return res.status(400).json({ message: "Image is required (file or URL)" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

    // ✅ Category Validation
    if (!req.body.category || !mongoose.Types.ObjectId.isValid(req.body.category)) {
      return res.status(400).json({ message: "Invalid category ID format" });
    }

    const productData = {
      name: req.body.name,
      price: Number.parseFloat(req.body.price),
      description: req.body.description,
      inStock: req.body.inStock === "true" || req.body.inStock === true, // Ensure it's boolean
      category: new mongoose.Types.ObjectId(req.body.category), // Ensure ObjectId format
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

// Update a Product
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
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      updateData.image = req.body.imageUrl;
    }

    console.log("Update data:", updateData); // Log the update data

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

// Get Products (With Optional Category Filtering)
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

// ✅ **Delete a Product**
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
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
