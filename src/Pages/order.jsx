import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

const steps = ["pending", "confirmed", "processing", "shipped", "delivered"];

function Order() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/orders/user/${user.id}`
        );

        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleDownloadInvoice = async (order) => {
    await fetch(
      "https://task-ocr.app.n8n.cloud/webhook/generate-invoice",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      }
    );

    alert("Invoice generation started.");
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">No Orders Found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">

      {orders.map((order) => {
        const currentStepIndex = steps.indexOf(order.status);

        return (
          <div
            key={order.id}
            className="border rounded-xl shadow-sm p-6 space-y-6"
          >

            {/* Header */}
            <div className="flex justify-between border-b pb-4">
              <div>
                <h1 className="text-2xl font-bold">
                  Order #{order.id}
                </h1>

                <p className="text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              <span className="px-3 py-1 bg-green-500 text-white rounded-full">
                {order.status.toUpperCase()}
              </span>
            </div>

            {/* Status */}
            <div className="flex justify-between">
              {steps.map((step, i) => (
                <div
                  key={step}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${
                      i <= currentStepIndex
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </div>

                  <p className="text-sm mt-1 capitalize">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Customer */}
            <div className="grid md:grid-cols-2 gap-4">

              <div className="border p-4 rounded-xl">
                <h2 className="font-semibold mb-2">
                  Customer
                </h2>

                <p>{order.users?.name}</p>
                <p>{order.users?.email}</p>
              </div>

              <div className="border p-4 rounded-xl">
                <h2 className="font-semibold mb-2">
                  Shipping
                </h2>

                <p>{order.shipping_address}</p>
              </div>

            </div>

            {/* Items */}
            <div className="border rounded-xl p-4">
              <h2 className="font-semibold mb-3">
                Items
              </h2>

              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-3 border-b last:border-0"
                >
                  <div className="flex gap-4">

                    <img
                      src={item.products?.image_url}
                      alt={item.products?.name}
                      className="w-16 h-16 rounded object-cover"
                    />

                    <div>
                      <p className="font-medium">
                        {item.products?.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Qty : {item.quantity}
                      </p>

                      <p className="text-sm text-gray-500">
                        ₹{item.price}
                      </p>
                    </div>

                  </div>

                  <p className="font-semibold">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border rounded-xl p-4">

              <div className="flex justify-between">
                <span>Total</span>

                <span className="font-semibold">
                  ₹{order.total_amount}
                </span>
              </div>

              <div className="mt-2 text-green-600">
                Payment : {order.payment_status}
              </div>

            </div>

            {/* Button */}
            <button
              onClick={() => handleDownloadInvoice(order)}
              className="bg-black text-white px-5 py-2 rounded-lg"
            >
              Download Invoice
            </button>

          </div>
        );
      })}
    </div>
  );
}

export default Order;