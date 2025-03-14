import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const AdminPanelOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      // Fetch user info to check admin status
      const userResponse = await axios.get("https://bhuwanenterprise.onrender.com/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsAdmin(userResponse.data.isAdmin);

     const url = `https://bhuwanenterprise.onrender.com/api/orders/all?page=${currentPage}&limit=10`;


      // Fetch orders based on user role
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data.orders || []);
      setFilteredOrders(response.data.orders || []);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Search Function - Filters orders by Order ID
  const handleSearch = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);

    if (query) {
      setFilteredOrders(orders.filter(order => order._id.includes(query)));
    } else {
      setFilteredOrders(orders);
    }
  };

  if (loading) return <p className="text-blue-500">Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{isAdmin ? "All Orders" : "My Orders"}</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Order ID..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      {filteredOrders.length > 0 ? (
        <>
          <OrdersTable orders={filteredOrders} isAdmin={isAdmin} />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

const OrdersTable = ({ orders, isAdmin }) => (
  <table className="w-full border-collapse border border-gray-300">
    <thead>
      <tr className="bg-gray-100">
        <th className="border border-gray-300 p-2">Order ID</th>
        {isAdmin && <th className="border border-gray-300 p-2">Customer</th>}
        <th className="border border-gray-300 p-2">Contact</th>
        <th className="border border-gray-300 p-2">Address</th>
        <th className="border border-gray-300 p-2">Items</th>
        <th className="border border-gray-300 p-2">Total</th>
        <th className="border border-gray-300 p-2">Created At</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((order) => (
        <OrderRow key={order._id} order={order} isAdmin={isAdmin} />
      ))}
    </tbody>
  </table>
);

const OrderRow = ({ order, isAdmin }) => (
  <tr className="border border-gray-300">
    <td className="p-2">{order._id}</td>
    {isAdmin && <td className="p-2">{order.customer?.name || "N/A"}</td>}
    <td className="p-2">
  {order.address?.email || "N/A"}
  <br />
  {order.address?.mobile || "N/A"}
</td>

    <td className="p-2">{order.customer?.address || "N/A"}</td>
    <td className="p-2">
      <ul className="list-disc pl-4">
        {order.items?.map((item) => (
          <li key={item.productId?._id || item._id} className="flex items-center gap-2">
            {item.productId?.image && (
              <img
                src={item.productId.image}
                alt={item.productId.name}
                className="w-10 h-10 object-cover rounded-md"
              />
            )}
            <span>
              {item.productId?.name || "Unknown Product"} - {item.quantity} x $
              {item.price.toFixed(2)}
            </span>
          </li>
        )) || "No items"}
      </ul>
    </td>
    <td className="p-2">₹{order.totalAmount.toFixed(2)}</td>
    <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
  </tr>
);

const PaginationControls = ({ currentPage, totalPages, setCurrentPage }) => (
  <div className="flex justify-center mt-4 space-x-2">
    <button
      className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    >
      Previous
    </button>
    <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
    <button
      className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    >
      Next
    </button>
  </div>
);

export default AdminPanelOrders;
