import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [refresh, setRefresh] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/all`);

        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      await axios.put(`${API_URL}/orders/${orderId}`, {
        status,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading Orders...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Order ID</th>

              <th className="p-3 text-left">Customer</th>

              <th className="p-3 text-left">Amount</th>

              <th className="p-3 text-left">Payment</th>

              <th className="p-3 text-left">Status</th>

              <th className="p-3 text-left">Date</th>

              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-3">#{order.id}</td>

                <td className="p-3">{order.users?.email}</td>

                <td className="p-3">₹{order.total_amount}</td>

                <td className="p-3">{order.payment_method}</td>

                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-yellow-100">
                    {order.status}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>

                <td className="p-3">
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>

                    <option value="confirmed">Confirmed</option>

                    <option value="processing">Processing</option>

                    <option value="shipped">Shipped</option>

                    <option value="delivered">Delivered</option>

                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
