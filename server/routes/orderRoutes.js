const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Fetch all orders (no authentication required)
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId").exec();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ✅ Fetch orders for the logged-in user
router.get("/myorders", authMiddleware.verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).populate("items.productId").exec();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user's orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ✅ Create a new order (authentication required)
router.post("/", authMiddleware.verifyToken, async (req, res) => {
  try {
    const { cart, total } = req.body;
    const customerId = req.user.id;

    const items = cart.map((item) => ({
      productId: item._id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const order = new Order({
      customer: customerId,
      items,
      totalAmount: total,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
});

module.exports = router;
