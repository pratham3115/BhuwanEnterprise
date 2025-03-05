import React, { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          setLoading(false);
          return;
        }

        // ✅ Fetch user details from the new correct route
        const userResponse = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsAdmin(userResponse.data.isAdmin);

        // ✅ Use the correct API endpoint based on role
        const url = userResponse.data.isAdmin
          ? "http://localhost:5000/api/orders/all" // Admins see all orders
          : "http://localhost:5000/api/orders/myorders"; // Customers see only their orders

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-blue-500">Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{isAdmin ? "All Orders" : "My Orders"}</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Order ID</th>
              {isAdmin && <th className="border border-gray-300 p-2">Customer Name</th>}
              <th className="border border-gray-300 p-2">Items</th>
              <th className="border border-gray-300 p-2">Total</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border border-gray-300">
                <td className="p-2">{order._id}</td>
                {isAdmin && <td className="p-2">{order.customer?.name || "N/A"}</td>}
                <td className="p-2">
                  <ul className="list-disc pl-4">
                    {order.items.map((item) => (
                      <li key={item.productId}>
                        {item.productName} (x{item.quantity})
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-2">${order.totalAmount.toFixed(2)}</td>
                <td className="p-2">{order.status || "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Orders;
