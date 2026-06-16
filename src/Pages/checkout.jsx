import { useState } from "react";
import axios from "axios";
import useCart from "../hooks/useCart";
const API_URL = import.meta.env.VITE_API_URL;

function Checkout() {
  const { cartItems } = useCart();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const payload = {
        user_id: localStorage.getItem("user_id"), // or from auth context
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await axios.post(
        `${API_URL}/checkout/`,
        payload
      );

      console.log(response.data);

      alert(`Order Created: ${response.data.order_id}`);

      // navigate("/order-success");
    } catch (error) {
      console.error(error);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>

      <input
        name="full_name"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
      />

      <textarea
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />

      <h3>Order Summary</h3>

      {cartItems.map((item) => (
        <div key={item.id}>
          {item.name} × {item.quantity}
        </div>
      ))}

      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}

export default Checkout;