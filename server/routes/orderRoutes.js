const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

// Helper function to calculate pagination
const calculatePagination = (totalItems, limit, page) => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalPages,
    currentPage: parseInt(page, 10),
  };
};

// Fetch all orders (Admin Access)
router.get("/all", async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;

  try {
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find()
      .populate("items.productId")
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const { totalPages, currentPage } = calculatePagination(totalOrders, limit, page);

    res.status(200).json({
      orders: orders.map(order => ({
        ...order.toObject(),
        currency: order.currency || "INR",
      })),
      totalPages,
      currentPage,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Fetch orders for the logged-in user
router.get("/myorders", authMiddleware.verifyToken, async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized: No user ID found" });
  }

  try {
    const totalOrders = await Order.countDocuments({ customer: req.user.id });
    const orders = await Order.find({ customer: req.user.id })
      .populate("items.productId")
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const { totalPages, currentPage } = calculatePagination(totalOrders, limit, page);

    res.status(200).json({
      orders: orders.map(order => ({
        ...order.toObject(),
        currency: order.currency || "INR",
      })),
      totalPages,
      currentPage,
    });
  } catch (error) {
    console.error("Error fetching user's orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Create a new order
router.post("/", authMiddleware.verifyToken, async (req, res) => {
  try {
    console.log("Incoming Order Data:", req.body);
    const { items, totalAmount, customer, currency = "INR" } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty or invalid" });
    }

    const total = parseFloat(totalAmount);
    if (isNaN(total) || total <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    if (!customer || !customer.name || !customer.email || !customer.mobile) {
      return res.status(400).json({ message: "Invalid customer details" });
    }

    const orderItems = items.map((item) => {
      if (!item._id || !item.name || !item.quantity || !item.price) {
        throw new Error("Invalid cart item format");
      }
      return {
        productId: item._id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      };
    });

    const order = new Order({
      customer: req.user.id,
      items: orderItems,
      totalAmount: total,
      currency,
      address: customer,
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
});

module.exports = router;
