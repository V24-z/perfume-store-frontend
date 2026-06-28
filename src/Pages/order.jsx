import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import { Box, User, MapPin, ShoppingBag, CheckCircle2, Circle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const steps = ["pending", "confirmed", "processing", "shipped", "delivered"];

// ─── Status Badge Styling Classes ───────────────────────────────────────────
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
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 ring-inset ${twClass}`}>
      {status}
    </span>
  );
}

function Order() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/user/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Syncing Order Vault...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200/60 shadow-sm mb-4">
          <ShoppingBag size={24} />
        </div>
        <h2 className="text-lg font-black text-[#1a0533] tracking-tight">No Orders Found</h2>
        <p className="text-xs text-slate-400 mt-1">You haven't customized or placed any signature fragrance orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 antialiased font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* ══ SECTION HEADER ══ */}
        <div className="border-b border-slate-200/60 pb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-violet-600 to-fuchsia-600" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-violet-600">Account Concierge</p>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#1a0533]">Order History</h1>
        </div>

        {/* ══ ORDERS STACK LOOP ══ */}
        {orders.map((order) => {
          const currentStepIndex = steps.indexOf(order.status);

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-8 transition-all duration-300 hover:shadow-md"
            >
              {/* Card Meta Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center shadow-inner shrink-0">
                    <Box size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#1a0533] tracking-tight">
                      Order ID: #{order.id}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <StatusBadge status={order.status} />
                </div>
              </div>

              {/* Status Stepper Tracker */}
              <div className="py-2 overflow-x-auto">
                <div className="flex items-center w-full min-w-[600px] relative">
                  {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div key={step} className="flex-1 flex flex-col items-center relative">
                        {/* Joining Line connecting progress points */}
                        {index < steps.length - 1 && (
                          <div 
                            className={`absolute top-4 left-1/2 w-full h-[3px] -z-10 transition-colors duration-300 ${
                              index < currentStepIndex ? "bg-emerald-500" : "bg-slate-100"
                            }`} 
                          />
                        )}

                        {/* Interactive Dot Node */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border transition-all duration-300 ${
                            isCompleted
                              ? "bg-emerald-500 border-emerald-600 text-white"
                              : "bg-white border-slate-200 text-slate-400"
                          } ${isCurrent ? "ring-4 ring-emerald-500/10 scale-110" : ""}`}
                        >
                          {isCompleted ? <CheckCircle2 size={15} /> : <Circle size={12} strokeWidth={3} />}
                        </div>

                        {/* Node Label Title */}
                        <p className={`text-[11px] font-bold mt-2.5 capitalize tracking-wide ${
                          isCurrent ? "text-slate-900" : isCompleted ? "text-slate-600" : "text-slate-400"
                        }`}>
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer & Shipping Split Address Info Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <User size={14} className="text-violet-600" />
                    <h4 className="text-[10px] uppercase font-bold tracking-wider">Recipient Details</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-800">{order.users?.name || "—"}</p>
                  <p className="text-xs font-medium text-slate-500">{order.users?.email || "—"}</p>
                </div>

                <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <MapPin size={14} className="text-violet-600" />
                    <h4 className="text-[10px] uppercase font-bold tracking-wider">Destination Route</h4>
                  </div>
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">{order.shipping_address || "No dynamic address object found"}</p>
                </div>
              </div>

              {/* Inner Order Item Catalog Cards */}
              <div className="border border-slate-100 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center gap-1.5 text-slate-400 pb-2 border-b border-slate-50">
                  <ShoppingBag size={13} className="text-violet-600" />
                  <h4 className="text-[10px] uppercase font-bold tracking-wider">Manifest Summary</h4>
                </div>

                {order.order_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0 last:pb-0"
                  >
                    <div className="flex gap-4 items-center min-w-0">
                      <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0 shadow-inner">
                        <img
                          src={item.products?.image_url}
                          alt={item.products?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold text-xs text-slate-800 truncate max-w-[240px] sm:max-w-md">
                          {item.products?.name}
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                          Qty: {item.quantity} · Price: ₹{new Intl.NumberFormat("en-IN").format(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="font-bold text-xs text-slate-900 shrink-0 ml-4">
                      ₹{new Intl.NumberFormat("en-IN").format(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Metadata Totals Block */}
              <div className="bg-slate-900 text-white rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
                
                {/* Total */}
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Total Valuation</span>
                  <span className="text-base font-black text-white mt-0.5">
                    ₹{new Intl.NumberFormat("en-IN").format(order.total_amount)}
                  </span>
                </div>

                {/* Payment Status */}
                <div className="flex flex-col justify-center sm:pl-4 pt-3 sm:pt-0">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Billing Status</span>
                  <span className="text-xs font-bold text-emerald-400 capitalize mt-0.5">
                    ● {order.payment_status}
                  </span>
                </div>

                {/* Payment Method */}
                <div className="flex flex-col justify-center sm:pl-4 pt-3 sm:pt-0">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Gateway Channel</span>
                  <span className="text-xs font-mono font-bold uppercase text-slate-300 mt-1">
                    {order.payment_method}
                  </span>
                </div>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Order;