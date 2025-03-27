import React from "react";
import { X } from "lucide-react";
import "../styles/Product-Model.css";

const ProductModal = ({ product, onClose, handleAddToCart }) => {
  if (!product) return null;

  // Conversion rate (1 USD = 83 INR)
  const USD_TO_INR = 83;
  
  // Ensure the image URL is correctly constructed
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `http://localhost:5000${product.image}`;

  // Convert price to rupees
  const priceInRupees = (product.price * USD_TO_INR).toFixed(2);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <X />
        </button>
        <div className="modal-image-container">
          <img src={imageUrl} alt={product.name} className="modal-image" />
        </div>
        <div className="modal-details">
          <h2 className="modal-title">{product.name}</h2>
          <p className="modal-description">{product.description}</p>
          <div className="modal-price-stock">
            <p className="modal-price">₹{priceInRupees}</p>
            <p className="modal-stock">{product.inStock ? "In Stock" : "Out of Stock"}</p>
          </div>
          <div className="modal-actions">
            <button
              className="add-to-cart-button"
              onClick={() => handleAddToCart(product)}
              disabled={!product.inStock}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
