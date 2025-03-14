import React, { useState } from "react";
import axios from "axios";
import { Button, Input, Label, Card, CardHeader, CardContent, CardTitle } from "./UtilityComponents";

const API_BASE_URL = process.env.API_BASE_URL;

const AdminPanelCategories = ({ categories, setCategories, showToast, setLoading, loading, searchTerm }) => {
  const [categoryFormData, setCategoryFormData] = useState({ name: "", image: "", imageFile: null });
  const [editingCategory, setEditingCategory] = useState(null);

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
        const response = await axios.post(`${API_BASE_URL}/api/categories`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
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
    setCategoryFormData({ name: category.name, image: category.image, imageFile: null });
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
        const response = await axios.put(`${API_BASE_URL}/api/categories/${editingCategory._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setCategories(categories.map((category) => (category._id === editingCategory._id ? response.data : category)));
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
        await axios.delete(`${API_BASE_URL}/api/categories/${id}`);
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

  const filteredCategories = categories.filter((category) =>
    category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input id="categoryName" name="name" value={categoryFormData.name} onChange={handleCategoryInputChange} placeholder="Enter category name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categoryImage">Category Image URL</Label>
            <Input id="categoryImage" name="image" value={categoryFormData.image} onChange={handleCategoryInputChange} placeholder="Enter category image URL" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categoryImageFile">Or Upload Image</Label>
            <Input id="categoryImageFile" name="imageFile" type="file" accept="image/*" onChange={handleCategoryInputChange} />
          </div>
          {(categoryFormData.image || categoryFormData.imageFile) && (
            <div className="mt-2">
              <img src={categoryFormData.image || categoryFormData.imageFile} alt="Category preview" className="w-32 h-32 object-cover rounded-lg" />
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
                    <img src={category.image || "/placeholder.svg"} alt={category.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-semibold">{category.name}</h4>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category._id)} disabled={loading}>
                        Delete
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleEditCategory(category)} disabled={loading}>
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

export default AdminPanelCategories;
