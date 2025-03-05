import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./customer/components/navigation/navigation";
import Home from "./customer/components/home";
import ProductPage from "./customer/components/product-page";
import Contact from "./customer/components/contact";
import About from "./customer/components/aboutus";
import CheckoutPage from "./customer/components/CheckoutPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminPanel from "./customer/components/admin-panel";
import Orders from "./pages/Order";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { user } = useAuth() || {};
  const [cart, setCart] = useState(new Map());

  const calculateTotal = () => {
    return Array.from(cart.values())
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleUpdateQuantity = (productId, quantity) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      const item = newCart.get(productId);
      if (item && quantity > 0) {
        newCart.set(productId, { ...item, quantity });
      } else {
        newCart.delete(productId);
      }
      return newCart;
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      newCart.delete(productId);
      return newCart;
    });
  };

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductPage cart={cart} setCart={setCart} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Checkout Page */}
        <Route
          path="/checkout"
          element={user ? (
            <CheckoutPage
              cart={cart}
              calculateTotal={calculateTotal}
              handleUpdateQuantity={handleUpdateQuantity}
              handleRemoveFromCart={handleRemoveFromCart}
            />
          ) : (
            <Navigate to="/login" replace />
          )}
        />

        {/* Protected Orders Page */}
        <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" replace />} />

        {/* Admin Panel (No Login Check) */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
