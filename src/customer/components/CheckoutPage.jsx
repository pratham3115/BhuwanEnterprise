import React, { useState } from "react";
import "./CheckoutPage.css"; // Import the CSS file
import PropTypes from "prop-types";
import { Plus, Minus, Trash } from "lucide-react";

export default function CheckoutPage({ cart, calculateTotal, handleUpdateQuantity, handleRemoveFromCart }) {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    mobile: "",
    country: "",
    state: "",
    city: "",
    zip: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const orderData = {
      ...userInfo,
      cart: Array.from(cart.values()),
      total: calculateTotal(),
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to place an order.");
        setIsLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        console.log("Order placed successfully!");
        alert("Order placed successfully!");
      } else {
        const errorText = await response.text();
        console.error("Error placing order:", errorText);
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-container">
        <div className="order-summary">
          <h3>Order Summary</h3>
          {Array.from(cart.values()).length > 0 ? (
            Array.from(cart.values()).map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image || "/placeholder.png"} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>₹{item.price.toFixed(2)} x {item.quantity}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)} aria-label="Decrease Quantity">
                      <Minus className="quantity-icon" aria-hidden="true" />
                    </button>
                    <span aria-label="Quantity">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} aria-label="Increase Quantity">
                      <Plus className="quantity-icon" aria-hidden="true" />
                    </button>
                    <button onClick={() => handleRemoveFromCart(item._id)} className="remove-button" aria-label="Remove from Cart">
                      <Trash className="remove-icon" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
          <div className="total">
            <h4>Total:</h4>
            <p>₹{calculateTotal()}</p>
          </div>
        </div>
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>User Information</h3>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            required
          />
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="mobile"
            value={userInfo.mobile}
            onChange={handleInputChange}
            placeholder="Mobile No"
            required
          />
          <input
            type="text"
            name="country"
            value={userInfo.country}
            onChange={handleInputChange}
            placeholder="Country"
            required
          />
          <input
            type="text"
            name="state"
            value={userInfo.state}
            onChange={handleInputChange}
            placeholder="State"
            required
          />
          <input
            type="text"
            name="city"
            value={userInfo.city}
            onChange={handleInputChange}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="zip"
            value={userInfo.zip}
            onChange={handleInputChange}
            placeholder="ZIP Code"
            required
          />
          <button type="submit" className="checkout-button" disabled={isLoading}>
            {isLoading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}

CheckoutPage.propTypes = {
  cart: PropTypes.instanceOf(Map).isRequired,
  calculateTotal: PropTypes.func.isRequired,
  handleUpdateQuantity: PropTypes.func.isRequired,
  handleRemoveFromCart: PropTypes.func.isRequired,
};

CheckoutPage.defaultProps = {
  cart: new Map(),
  calculateTotal: () => 0,
  handleUpdateQuantity: () => {},
  handleRemoveFromCart: () => {},
};
