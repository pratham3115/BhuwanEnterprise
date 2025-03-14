import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AdminPanelCategories from "./AdminPanelCategories";
import AdminPanelProducts from "./AdminPanelProducts";
import AdminPanelOrders from "./AdminPanelOrders";
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Toast
} from "./UtilityComponents";
import "./admin-panel.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);

  const ADMIN_CREDENTIALS = { username: "BE@admin", password: "md.Y/W(At&!Tq3nr%)~>]px8:E;b#HS=`[w-McD6R^e$@7zV}s" };

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`https://bhuwanenterprise.onrender.com/api/products`);
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      showToast("Failed to fetch products.", "error");
    }
  }, [showToast]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`https://bhuwanenterprise.onrender.com/api/categories`);
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast("Failed to fetch categories.", "error");
    }
  }, [showToast]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders/all`);
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
    if (
      loginData.username === ADMIN_CREDENTIALS.username &&
      loginData.password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
    } else {
      showToast("Invalid username or password", "error");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginData({ username: "", password: "" });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

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
            <AdminPanelCategories
              categories={categories}
              setCategories={setCategories}
              showToast={showToast}
              setLoading={setLoading}
              loading={loading}
              searchTerm={searchTerm}
            />
          </TabsContent>

          <TabsContent isActive={activeTab === "products"}>
            <AdminPanelProducts
              products={products}
              setProducts={setProducts}
              categories={categories}
              showToast={showToast}
              setLoading={setLoading}
              loading={loading}
              searchTerm={searchTerm}
            />
          </TabsContent>

          <TabsContent isActive={activeTab === "orders"}>
            <AdminPanelOrders orders={orders} searchTerm={searchTerm} />
          </TabsContent>
        </Tabs>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
