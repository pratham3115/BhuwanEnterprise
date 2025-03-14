import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

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

        const { data: user } = await axios.get(`https://bhuwanenterprise.onrender.com/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsAdmin(user.isAdmin);

        const url = user.isAdmin
          ? `https://bhuwanenterprise.onrender.com/api/orders/all`
          : `https://bhuwanenterprise.onrender.com/api/orders/myorders`;

        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch orders");
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

      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Order ID</th>
                {isAdmin && <th className="border border-gray-300 p-2">Customer</th>}
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
                      {order.items?.length > 0 ? (
                        order.items.map((item) => (
                          <li key={item.productId}>
                            {item.productName} (x{item.quantity})
                          </li>
                        ))
                      ) : (
                        <li>No items</li>
                      )}
                    </ul>
                  </td>
                  <td className="p-2">₹{order.totalAmount?.toFixed(2) || "0.00"}</td>
                  <td className="p-2">{order.status || "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default Orders;
