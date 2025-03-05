// 

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./admin-panel.css";

// Utility Components
const Button = ({ children, onClick, disabled, variant = "primary", size = "md", className = "" }) => {
  const baseStyle = "font-semibold rounded focus:outline-none transition-colors";
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ id, name, value, onChange, type = "text", placeholder, required, accept }) => (
  <input
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    type={type}
    placeholder={placeholder}
    required={required}
    accept={accept}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

const Textarea = ({ id, name, value, onChange, placeholder }) => (
  <textarea
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    rows="3"
  />
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>{children}</div>
);

const CardHeader = ({ children }) => <div className="px-6 py-4 border-b">{children}</div>;

const CardContent = ({ children }) => <div className="px-6 py-4">{children}</div>;

const CardTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;

const Switch = ({ id, checked, onChange }) => (
  <label htmlFor={id} className="flex items-center cursor-pointer">
    <div className="relative">
      <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className={`block w-14 h-8 rounded-full ${checked ? "bg-blue-500" : "bg-gray-300"}`}></div>
      <div
        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${checked ? "transform translate-x-6" : ""}`}
      ></div>
    </div>
  </label>
);

const Tabs = ({ children }) => <div className="mb-4">{children}</div>;

const TabsList = ({ children }) => <div className="flex border-b">{children}</div>;

const TabsTrigger = ({ children, isActive, onClick }) => (
  <button
    className={`px-4 py-2 font-semibold ${
      isActive ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-700"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

const TabsContent = ({ children, isActive }) => <div className={isActive ? "block" : "hidden"}>{children}</div>;

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-md text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
};

// Main Component
export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    imagePreview: null,
    inStock: true,
    category: "",
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    image: "",
    imageFile: null,
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);

  const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "123",
  };

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Response data:", error.response.data);
        showToast(`Failed to fetch products. Server responded with: ${error.response.statusText}`, "error");
      } else if (error.request) {
        // Request was made but no response was received
        console.error("No response received:", error.request);
        showToast("Failed to fetch products. No response received from the server.", "error");
      } else {
        // Something else caused the error
        console.error("Error message:", error.message);
        showToast(`Failed to fetch products. Error: ${error.message}`, "error");
      }
    }
  }, [showToast]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast("Failed to fetch categories.", "error");
    }
  }, [showToast]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders/all"); // ✅ No token required
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      showToast("Failed to fetch orders.", "error");
    }
  }, [showToast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchCategories();
      fetchOrders();
    }
  }, [isAuthenticated, fetchProducts, fetchCategories, fetchOrders]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === ADMIN_CREDENTIALS.username && loginData.password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
    } else {
      showToast("Invalid username or password", "error");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginData({ username: "", password: "" });
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0], imagePreview: URL.createObjectURL(files[0]) });
    } else if (type === "number") {
      setFormData({ ...formData, [name]: value === "" ? "" : Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCategoryInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setCategoryFormData({ ...categoryFormData, [name]: URL.createObjectURL(files[0]), imageFile: files[0] });
    } else {
      setCategoryFormData({ ...categoryFormData, [name]: value });
    }
  };

  const handleAddCategory = async () => {
    if (categoryFormData.name.trim()) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("name", categoryFormData.name);
        if (categoryFormData.imageFile) {
          formData.append("image", categoryFormData.imageFile);
        } else if (categoryFormData.image) {
          formData.append("imageUrl", categoryFormData.image);
        }
        const response = await axios.post("http://localhost:5000/api/categories", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setCategories([...categories, response.data]);
        setCategoryFormData({ name: "", image: "", imageFile: null });
        showToast("Category added successfully!");
      } catch (err) {
        console.error("Error adding category:", err);
        showToast("Failed to add category.", "error");
      } finally {
        setLoading(false);
      }
    } else {
      showToast("Please enter a category name.", "error");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      image: category.image,
      imageFile: null,
    });
  };

  const handleUpdateCategory = async () => {
    if (editingCategory && categoryFormData.name.trim()) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("name", categoryFormData.name);
        if (categoryFormData.imageFile) {
          formData.append("image", categoryFormData.imageFile);
        } else if (categoryFormData.image) {
          formData.append("imageUrl", categoryFormData.image);
        }

        const response = await axios.put(
          `http://localhost:5000/api/categories/${editingCategory._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setCategories(
          categories.map((category) =>
            category._id === editingCategory._id ? response.data : category
          )
        );
        setEditingCategory(null);
        setCategoryFormData({ name: "", image: "", imageFile: null });
        showToast("Category updated successfully!");
      } catch (err) {
        console.error("Error updating category:", err);
        showToast("Failed to update category.", "error");
      } finally {
        setLoading(false);
      }
    } else {
      showToast("Please enter a category name.", "error");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
        setCategories(categories.filter((category) => category._id !== id));
        showToast("Category deleted successfully!");
      } catch (err) {
        console.error("Error deleting category:", err);
        showToast("Failed to delete category.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddProduct = async () => {
    setLoading(true);
    try {
      const productData = new FormData();
      productData.append("name", formData.name);
      productData.append("price", formData.price);
      productData.append("description", formData.description);
      productData.append("inStock", formData.inStock);
      productData.append("category", formData.category);

      if (formData.image instanceof File) {
        productData.append("image", formData.image);
      } else if (typeof formData.image === "string" && formData.image.trim() !== "") {
        productData.append("imageUrl", formData.image);
      } else {
        throw new Error("Image is required (file or URL)");
      }

      const response = await axios.post("http://localhost:5000/api/products", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProducts([...products, response.data]);
      resetForm();
      showToast("Product added successfully!");
    } catch (err) {
      console.error("Error adding product:", err.response ? err.response.data : err);
      showToast(`Failed to add product. ${err.response ? err.response.data.message : err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      imagePreview: null,
      inStock: product.inStock,
      category: product.category._id,
    });
  };

  const handleUpdateProduct = async () => {
    if (editingProduct && formData.name.trim()) {
      setLoading(true);
      try {
        const productData = new FormData();
        productData.append("name", formData.name);
        productData.append("price", formData.price);
        productData.append("description", formData.description);
        productData.append("inStock", formData.inStock);
        productData.append("category", formData.category);

        if (formData.image instanceof File) {
          productData.append("image", formData.image);
        } else if (typeof formData.image === "string" && formData.image.trim() !== "") {
          productData.append("imageUrl", formData.image);
        }

        const response = await axios.put(
          `http://localhost:5000/api/products/${editingProduct._id}`,
          productData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setProducts(
          products.map((product) =>
            product._id === editingProduct._id ? response.data : product
          )
        );
        setEditingProduct(null);
        resetForm();
        showToast("Product updated successfully!");
      } catch (err) {
        console.error("Error updating product:", err);
        showToast("Failed to update product.", "error");
      } finally {
        setLoading(false);
      }
    } else {
      showToast("Please enter a product name.", "error");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProducts(products.filter((product) => product._id !== id));
        showToast("Product deleted successfully!");
      } catch (err) {
        console.error("Error deleting product:", err);
        showToast("Failed to delete product.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStock = async (id, currentStatus) => {
    setLoading(true);
    try {
      const response = await axios.patch(`http://localhost:5000/api/products/${id}`, {
        inStock: !currentStatus,
      });
      setProducts(
        products.map((product) => (product._id === id ? { ...product, inStock: response.data.inStock } : product)),
      );
      showToast(`Product ${response.data.inStock ? "put in stock" : "put out of stock"} successfully!`);
    } catch (err) {
      console.error("Error updating product stock status:", err);
      showToast("Failed to update product stock status.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      image: "",
      imagePreview: null,
      inStock: true,
      category: "",
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const filteredProducts = products.filter(product =>
    product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredCategories = categories.filter(category =>
    category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredOrders = orders.filter(order =>
    order.name && order.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full max-w-lg"
          />
        </div>

        <Tabs>
          <TabsList>
            <TabsTrigger isActive={activeTab === "categories"} onClick={() => setActiveTab("categories")}>
              Categories
            </TabsTrigger>
            <TabsTrigger isActive={activeTab === "products"} onClick={() => setActiveTab("products")}>
              Products
            </TabsTrigger>
            <TabsTrigger isActive={activeTab === "orders"} onClick={() => setActiveTab("orders")}>
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent isActive={activeTab === "categories"}>
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      name="name"
                      value={categoryFormData.name}
                      onChange={handleCategoryInputChange}
                      placeholder="Enter category name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="categoryImage">Category Image URL</Label>
                    <Input
                      id="categoryImage"
                      name="image"
                      value={categoryFormData.image}
                      onChange={handleCategoryInputChange}
                      placeholder="Enter category image URL"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="categoryImageFile">Or Upload Image</Label>
                    <Input
                      id="categoryImageFile"
                      name="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryInputChange}
                    />
                  </div>
                  {(categoryFormData.image || categoryFormData.imageFile) && (
                    <div className="mt-2">
                      <img
                        src={categoryFormData.image || categoryFormData.imageFile}
                        alt="Category preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <Button onClick={editingCategory ? handleUpdateCategory : handleAddCategory} disabled={loading}>
                    {loading ? (editingCategory ? "Updating..." : "Adding...") : (editingCategory ? "Update Category" : "Add Category")}
                  </Button>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Existing Categories</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCategories.map((category) => (
                      <Card key={category._id}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-semibold">{category.name}</h4>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteCategory(category._id)}
                                disabled={loading}
                              >
                                Delete
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleEditCategory(category)}
                                disabled={loading}
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent isActive={activeTab === "products"}>
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input id="productName" name="name" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="productPrice">Price</Label>
                    <Input
                      id="productPrice"
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="productImage">Image URL</Label>
                    <Input
                      id="productImage"
                      name="image"
                      value={formData.image instanceof File ? "" : formData.image}
                      onChange={handleInputChange}
                      placeholder="Enter product image URL"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="productImageFile">Or Upload Image</Label>
                    <Input
                      id="productImageFile"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>
                  {formData.imagePreview && (
                    <div className="mt-2">
                      <img
                        src={formData.imagePreview || "/placeholder.svg"}
                        alt="Product preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="productCategory">Category</Label>
                    <select
                      id="productCategory"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="productInStock"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    />
                    <Label htmlFor="productInStock">In Stock</Label>
                  </div>
                  <div className="flex space-x-4">
                    <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct} disabled={loading}>
                      {loading ? (editingProduct ? "Updating..." : "Adding...") : (editingProduct ? "Update Product" : "Add Product")}
                    </Button>
                    <Button variant="secondary" onClick={resetForm}>
                      Reset
                    </Button>
                  </div>
                </form>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Existing Products</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <Card key={product._id}>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-lg mb-2"
                            />
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-gray-500">{product.description}</p>
                            <p className="font-medium">₹{product.price.toFixed(2)}</p>
                            <div className="flex items-center justify-between">
                              <Switch
                                id={`productInStock-${product._id}`}
                                checked={product.inStock}
                                onChange={() => handleToggleStock(product._id, product.inStock)}
                              />
                              <Label htmlFor={`productInStock-${product._id}`}>
                                {product.inStock ? "In Stock" : "Out of Stock"}
                              </Label>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteProduct(product._id)}
                                disabled={loading}
                              >
                                Delete
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                disabled={loading}
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent isActive={activeTab === "orders"}>
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order._id} className="border p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold">Order by {order.name}</h4>
                      <p>Email: {order.email}</p>
                      <p>Total: ₹{order.total.toFixed(2)}</p>
                      <h5 className="mt-2 font-medium">Items:</h5>
                      <ul className="list-disc list-inside">
                        {order.cart.map((item) => (
                          <li key={item._id}>
                            {item.name} - {item.quantity} x ₹{item.price.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
