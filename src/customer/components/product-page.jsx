import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart, Eye, X, Plus, Minus, Trash } from "lucide-react";
import Fuse from "fuse.js";
import ProductModal from "./ProductModal";
import SearchBar from "./SearchBar"; // Import the SearchBar component
import "../styles/product-page.css";
import { Link, useNavigate } from 'react-router-dom';

export default function ProductPage({ cart, setCart }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [showQuickView, setShowQuickView] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const categoriesWithImages = data.map((category) => ({
          ...category,
          image: category.image || "/placeholder.svg",
        }));
        setCategories(categoriesWithImages);
        if (categoriesWithImages.length > 0) setSelectedCategory(categoriesWithImages[0]);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetch(`http://localhost:5000/api/products?category=${selectedCategory._id}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          if (!searchTerm) {
            setFilteredProducts(data);
          }
        });
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    if (allProducts.length === 0) return;

    if (searchTerm === "") {
      setFilteredProducts(products);
      setSearchSuggestions([]);
    } else {
      const fuse = new Fuse(allProducts, {
        keys: ["name", "description", "category.name"],
        threshold: 0.3,
      });

      const result = fuse.search(searchTerm);
      const suggestions = result.map((res) => res.item);
      setFilteredProducts(suggestions);
      setSearchSuggestions(suggestions.slice(0, 5));
    }
  }, [searchTerm, allProducts, products]);

  const handleAddToCart = (product) => {
    if (!product.inStock) {
      alert("This product is out of stock!");
      return;
    }
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      const item = newCart.get(product._id);
      if (item) {
        newCart.set(product._id, { ...item, quantity: item.quantity + 1 });
      } else {
        newCart.set(product._id, { ...product, quantity: 1 });
      }
      return newCart;
    });
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

  const toggleWishlist = (productId) => {
    setWishlist((prevWishlist) => {
      const newWishlist = new Set(prevWishlist);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const calculateTotal = () => {
    let total = 0;
    Array.from(cart.values()).forEach((item) => {
      total += item.price * item.quantity;
    });
    return total.toFixed(2);
  };

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    navigate('/checkout');
  };

  const renderProductGrid = () => {
    return filteredProducts.map((product) => {
      const imageUrl = product.image.startsWith("http")
        ? product.image
        : `http://localhost:5000${product.image}`;

      return (
        <div
          key={product._id}
          className="product-card-wrapper"
          onClick={() => setShowQuickView(product)}
        >
          <div className="product-card">
            <div className="product-image-container">
              <img
                src={imageUrl || "/placeholder.png"}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
              <div className="product-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product._id);
                  }}
                  className={`wishlist-button ${wishlist.has(product._id) ? "in-wishlist" : ""}`}
                  aria-label={`${wishlist.has(product._id) ? "Remove from" : "Add to"} Wishlist`}
                >
                  <Heart className="action-icon" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQuickView(product);
                  }}
                  className="quickview-button"
                  aria-label="Quick View"
                >
                  <Eye className="action-icon" />
                </button>
              </div>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">₹{product.price.toFixed(2)}</p>
              {!product.inStock && (
                <p className="out-of-stock">Out of Stock</p>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className="add-to-cart-button"
                disabled={!product.inStock}
                aria-label="Add to Cart"
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuyNow(product);
                }}
                className="buy-now-button"
                disabled={!product.inStock}
                aria-label="Buy Now"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="product-page">
      <header className="header">
        <div className="container">
          <div className="header-actions">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <button onClick={() => setShowCart(true)} className="cart-button" aria-label="Open Cart">
              <ShoppingCart className="cart-icon" aria-hidden="true" />
              {cart.size > 0 && <span className="cart-count" aria-label="Cart Items">{cart.size}</span>}
            </button>
          </div>
        </div>
      </header>

      <nav className="category-nav">
        <div className="container">
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category._id} className="category-item">
                <button
                  className={`category-button ${selectedCategory?._id === category._id ? "selected" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <img src={category.image || "/placeholder.svg"} alt={category.name} className="category-image" />
                  <span>{category.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          <h2 className="section-title">{selectedCategory?.name || "All Products"}</h2>
          <div className="product-grid">{renderProductGrid()}</div>
        </div>
      </main>

      {showQuickView && (
        <ProductModal
          product={showQuickView}
          onClose={() => setShowQuickView(null)}
          handleAddToCart={handleAddToCart}
        />
      )}

      {showCart && (
        <div className="cart-modal">
          <div className="cart-modal-content">
            <button onClick={() => setShowCart(false)} className="close-button" aria-label="Close Cart">
              <X className="close-icon" aria-hidden="true" />
            </button>
            <h2>Your Cart</h2>
            {cart.size === 0 ? (
              <p className="empty-cart-message">Your cart is empty.</p>
            ) : (
              <>
                {Array.from(cart.values()).map((item) => (
                  <div key={item._id} className="cart-item">
                    <img src={item.image || "/placeholder.png"} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p>₹{item.price.toFixed(2)}</p>
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
                ))}
                <div className="cart-total">
                  <h3>Total:</h3>
                  <p>₹{calculateTotal()}</p>
                </div>
                <Link to="/checkout">
                  <button className="checkout-button">Proceed to Checkout</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
