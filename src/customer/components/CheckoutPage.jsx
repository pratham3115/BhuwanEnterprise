import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
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
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if not authenticated
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const isFormIncomplete = Object.values(userInfo).some((value) => value.trim() === "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (cart.size === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      setIsLoading(false);
      return;
    }

    if (isFormIncomplete) {
      alert("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to place an order.");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    const orderData = {
      customer: userInfo,
      items: Array.from(cart.values()),
      totalAmount: calculateTotal(),
    };

    try {
      const response = await fetch("https://bhuwanenterprise.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();
      if (response.ok) {
        alert("Order placed successfully!");
        navigate("/order-success"); // Redirect to success page
      } else {
        alert(`Failed to place order: ${responseData.message}`);
      }
    } catch (error) {
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
          {cart.size > 0 ? (
            Array.from(cart.values()).map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image || "/placeholder.png"} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>₹{item.price.toFixed(2)} x {item.quantity}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}>
                      <Minus className="quantity-icon" />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}>
                      <Plus className="quantity-icon" />
                    </button>
                    <button onClick={() => handleRemoveFromCart(item._id)} className="remove-button">
                      <Trash className="remove-icon" />
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
          {["name", "email", "mobile", "country", "state", "city", "zip"].map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              name={field}
              value={userInfo[field]}
              onChange={handleInputChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required
            />
          ))}
          <button type="submit" className="checkout-button" disabled={isLoading || isFormIncomplete}>
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
