import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const steps = ["pending", "confirmed", "processing", "shipped", "delivered"];

 function Order() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleDownloadInvoice = async () => {
    await fetch("https://task-ocr.app.n8n.cloud/webhook/generate-invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    alert("Invoice is being generated and will be sent soon.");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!order) return <div className="p-6">Order not found</div>;

  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <p className="text-gray-500">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>

        <span className="px-3 py-1 bg-green-500 text-white rounded-full">
          {order.status.toUpperCase()}
        </span>
      </div>

      {/* STATUS TRACKER */}
      <div className="flex justify-between">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center w-full">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${
                i <= currentStepIndex ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {i + 1}
            </div>
            <p className="text-sm mt-1">{step}</p>
          </div>
        ))}
      </div>

      {/* CUSTOMER */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border p-4 rounded-xl">
          <h2 className="font-semibold mb-2">Customer</h2>
          <p>{order.users?.email}</p>
        </div>

        <div className="border p-4 rounded-xl">
          <h2 className="font-semibold mb-2">Shipping</h2>
          <p>{order.shipping_address}</p>
        </div>
      </div>

      {/* ITEMS */}
      <div className="border rounded-xl p-4">
        <h2 className="font-semibold mb-3">Items</h2>

        {order.items?.map((item, i) => (
          <div key={i} className="flex justify-between py-2 border-b">
            <div>
              <p>{item.product_name}</p>
              <p className="text-sm text-gray-500">Qty: {item.qty}</p>
            </div>
            <p>₹{item.price * item.qty}</p>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <div className="border p-4 rounded-xl space-y-2">
        <div className="flex justify-between">
          <p>Total</p>
          <p>₹{order.total_amount}</p>
        </div>

        <div className="text-green-600">
          Payment: {order.payment_status}
        </div>
      </div>

      {/* ACTIONS */}
      <button
        onClick={handleDownloadInvoice}
        className="bg-black text-white px-5 py-2 rounded-lg"
      >
        Download Invoice
      </button>
    </div>
  );
}

export default Order