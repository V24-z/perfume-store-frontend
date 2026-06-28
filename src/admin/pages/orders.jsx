import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ─── Status Badge Variant Styling Mapping ─────────────────────────────────────
const STATUS_STYLES = {
  delivered:  "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  shipped:    "bg-sky-50 text-sky-700 ring-sky-600/10",
  pending:    "bg-amber-50 text-amber-800 ring-amber-600/10",
  processing: "bg-violet-50 text-violet-700 ring-violet-600/10",
  confirmed:  "bg-green-50 text-green-700 ring-green-600/10",
  cancelled:  "bg-red-50 text-red-700 ring-red-600/10",
};

function StatusBadge({ status = "" }) {
  const twClass = STATUS_STYLES[status.toLowerCase()] || "bg-gray-50 text-gray-600 ring-gray-500/10";
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${twClass}`}>
      {status}
    </span>
  );
}

// ─── Component Shimmer Skeleton Loader ────────────────────────────────────────
function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 bg-slate-200 rounded-xl animate-pulse w-1/4" />
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-slate-300 rounded animate-pulse flex-1" />)}
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              {[...Array(6)].map((_, j) => <div key={j} className="h-8 bg-slate-100 rounded animate-pulse flex-1" />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 sm:p-8">
        <div className="max-w-[1400px] mx-auto">
          <TableSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 antialiased font-sans p-6 sm:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* ══ HEADER ══ */}
        <div className="border-b border-slate-200/60 pb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-violet-600 to-fuchsia-600" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-violet-600">Lumière Console</p>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Orders Management</h1>
        </div>

        {/* ══ DATA TABLE CONTAINER ══ */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {orders.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <span className="text-3xl block mb-2">📦</span>
              <p className="text-sm font-medium">No system orders logged yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/60 text-slate-500 uppercase tracking-wider font-bold text-xs text-left">
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Payment</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr 
                      key={order.id} 
                      className="hover:bg-slate-50/40 transition-colors duration-150"
                    >
                      {/* ID */}
                      <td className="p-4 font-mono font-bold text-slate-400">
                        #{order.id}
                      </td>

                      {/* Customer */}
                      <td className="p-4 font-medium text-slate-700">
                        {order.users?.email || "—"}
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-extrabold text-slate-900">
                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(order.total_amount)}
                      </td>

                      {/* Payment Method */}
                      <td className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {order.payment_method}
                      </td>

                      {/* Status pill badge */}
                      <td className="p-4">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Local Timestamp */}
                      <td className="p-4 text-slate-500">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>

                      {/* Actions Context Select Box */}
                      <td className="p-4 text-right">
                        <div className="inline-block relative">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className={`text-xs font-semibold bg-white pl-3 pr-8 py-2 rounded-lg border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                              updatingId === order.id ? "animate-pulse" : ""
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400 border-l border-slate-100 ml-2">
                            <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Orders;