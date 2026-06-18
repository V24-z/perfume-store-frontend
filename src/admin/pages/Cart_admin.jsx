import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
function AdminCart() {
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/cart/all_cart`)
      .then((res) => setCarts(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Carts</h2>

      <table className="w-full border">
        <thead>
          <tr>
            <th>User</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {carts.map((item) => (
            <tr key={item.id}>
              <td>{item.users?.email}</td>
              <td>{item.products?.name}</td>
              <td>{item.quantity}</td>
              <td>
                ₹{item.quantity * item.products?.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCart;