import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button, Input, Label, Card, CardHeader, CardContent, CardTitle, Switch, Textarea, Toast } from "./UtilityComponents";

const AdminPanelProducts = ({ products, setProducts, categories, showToast, setLoading, loading, searchTerm }) => {
  const [formData, setFormData] = useState({ name: "", price: "", description: "", image: "", imagePreview: null, inStock: true, category: "" });
  const [editingProduct, setEditingProduct] = useState(null);

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
      const response = await axios.post("https://bhuwanenterprise.onrender.com/api/products", productData, {
        headers: { "Content-Type": "multipart/form-data" },
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
    setFormData({ name: product.name, price: product.price, description: product.description, image: product.image, imagePreview: null, inStock: product.inStock, category: product.category._id });
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
        const response = await axios.put(`https://bhuwanenterprise.onrender.com/api/products/${editingProduct._id}`, productData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProducts(products.map((product) => (product._id === editingProduct._id ? response.data : product)));
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
        await axios.delete(`https://bhuwanenterprise.onrender.com/api/products/${id}`);
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
      const response = await axios.patch(`https://bhuwanenterprise.onrender.com/api/products/${id}`, { inStock: !currentStatus });
      setProducts(products.map((product) => (product._id === id ? { ...product, inStock: response.data.inStock } : product)));
      showToast(`Product ${response.data.inStock ? "put in stock" : "put out of stock"} successfully!`);
    } catch (err) {
      console.error("Error updating product stock status:", err);
      showToast("Failed to update product stock status.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", description: "", image: "", imagePreview: null, inStock: true, category: "" });
  };

  const filteredProducts = products.filter((product) =>
    product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
            <Input id="productPrice" type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.01" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="productDescription">Description</Label>
            <Textarea id="productDescription" name="description" value={formData.description} onChange={handleInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="productImage">Image URL</Label>
            <Input id="productImage" name="image" value={formData.image instanceof File ? "" : formData.image} onChange={handleInputChange} placeholder="Enter product image URL" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="productImageFile">Or Upload Image</Label>
            <Input id="productImageFile" name="image" type="file" accept="image/*" onChange={handleInputChange} />
          </div>
          {formData.imagePreview && (
            <div className="mt-2">
              <img src={formData.imagePreview || "/placeholder.svg"} alt="Product preview" className="w-32 h-32 object-cover rounded-lg" />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="productCategory">Category</Label>
            <select id="productCategory" name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="productInStock" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} />
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
                    <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-2" />
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.description}</p>
                    <p className="font-medium">₹{product.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between">
                      <Switch id={`productInStock-${product._id}`} checked={product.inStock} onChange={() => handleToggleStock(product._id, product.inStock)} />
                      <Label htmlFor={`productInStock-${product._id}`}>{product.inStock ? "In Stock" : "Out of Stock"}</Label>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product._id)} disabled={loading}>
                        Delete
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleEditProduct(product)} disabled={loading}>
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
  );
};

export default AdminPanelProducts;
