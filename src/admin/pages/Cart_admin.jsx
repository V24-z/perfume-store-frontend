import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function AdminCart() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const res = await axios.get(`${API_URL}/cart/all_cart`);
        setCarts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  const deleteCartItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/cart/${id}`);

      setCarts((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = carts.filter((item) =>
    item.users?.email
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalValue = carts.reduce(
    (sum, item) =>
      sum +
      (item.products?.price || 0) *
        item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Cart Management
        </h1>

        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border px-4 py-2 rounded-lg"
        />
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Total Cart Items
          </p>
          <h2 className="text-2xl font-bold">
            {carts.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Unique Users
          </p>
          <h2 className="text-2xl font-bold">
            {
              new Set(
                carts.map((c) => c.user_id)
              ).size
            }
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Cart Value
          </p>
          <h2 className="text-2xl font-bold">
            ₹{totalValue}
          </h2>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                User
              </th>

              <th className="p-3 text-left">
                Product
              </th>

              <th className="p-3 text-left">
                Price
              </th>

              <th className="p-3 text-left">
                Qty
              </th>

              <th className="p-3 text-left">
                Total
              </th>

              <th className="p-3 text-left">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="border-t"
              >
                <td className="p-3">
                  {item.users?.email}
                </td>

                <td className="p-3 flex items-center gap-3">
                  <img
                    src={item.products?.image_url}
                    alt=""
                    className="w-12 h-12 rounded object-cover"
                  />

                  {item.products?.name}
                </td>

                <td className="p-3">
                  ₹{item.products?.price}
                </td>

                <td className="p-3">
                  {item.quantity}
                </td>

                <td className="p-3 font-semibold">
                  ₹
                  {item.quantity *
                    item.products?.price}
                </td>

                <td className="p-3">
                  <button
                    onClick={() =>
                      deleteCartItem(item.id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default AdminCart;