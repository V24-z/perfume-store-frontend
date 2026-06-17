import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useCart from "../context/useCart";
import { useAuth } from "../context/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

function Checkout() {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Phone number is required");
      return;
    }

    if (!formData.address.trim()) {
      alert("Address is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        user_id: user.id,
        shipping_address: formData.address,
        phone_number: formData.phone,
      };

      const response = await axios.post(`${API_URL}/orders/checkout`, payload);

      alert(`Order Created Successfully!`);

      navigate(`/order-success/${response.data.order_id}`);
    } catch (error) {
      console.error("Checkout Error:", error);

      const message = error.response?.data?.detail || "Checkout failed";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {" "}
      <h2 className="text-2xl font-semibold mb-6">Checkout </h2>
      <div className="space-y-4 mb-8">
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <textarea
          name="address"
          placeholder="Shipping Address"
          value={formData.address}
          onChange={handleChange}
          rows={4}
          className="w-full border rounded-lg p-3"
        />
      </div>
      <h3 className="text-xl font-medium mb-4">Order Summary</h3>
      <div className="space-y-2 mb-6">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex justify-between border-b pb-2">
              <span>{item.name}</span>
              <span>× {item.quantity}</span>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      <button
        onClick={handleCheckout}
        disabled={loading || cartItems.length === 0}
        className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}

export default Checkout;
