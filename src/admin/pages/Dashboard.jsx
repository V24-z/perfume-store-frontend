import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// HELPER: Safely generate headers containing the stored bearer token
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token"); 
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// ─── Refined Helper Formatting ────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-IN").format(n ?? 0);
const fmtRupee = (n) => `₹${fmt(n)}`;
const fmtDate  = (s) => s ? new Date(s).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";

// ─── Shimmer Loading Skeleton ─────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`rounded-lg bg-slate-200 animate-pulse ${className}`} />;
}

// ─── Status Badge mapping cleanly to standard tailwind classes ─────────────
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
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${twClass}`}>
      {status}
    </span>
  );
}

// ─── Modern Card Component ───────────────────────────────────────────────────
function KpiCard({ label, value, sub, subColorClass, icon, danger, loading }) {
  return (
    <div className={`bg-white rounded-xl p-5 border shadow-sm transition-all duration-200 hover:shadow-md ${danger ? "border-red-200 bg-red-50/10" : "border-slate-200/80"}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
        <span className="text-xl p-2 rounded-lg bg-slate-50 border border-slate-100">{icon}</span>
      </div>
      <div className="mt-2">
        {loading ? (
          <Skeleton className="h-8 w-24 my-1" />
        ) : (
          <p className={`text-2xl font-bold tracking-tight ${danger ? "text-red-600" : "text-slate-900"}`}>{value}</p>
        )}
        <p className={`text-xs font-medium mt-1 ${subColorClass || "text-slate-500"}`}>{sub}</p>
      </div>
    </div>
  );
}

// ─── Clean Bar Graph ──────────────────────────────────────────────────────────
function MiniBar({ label, value, max, tailwindBg }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-slate-600 truncate max-w-[180px]">{label}</span>
        <span className="font-bold text-slate-900">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${tailwindBg || "bg-violet-600"}`} 
          style={{ width: `${pct}%` }} 
        />
      </div>
    </div>
  );
}

// ─── Order Status Donut Component ─────────────────────────────────────────────
function StatusDonut({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <p className="text-xs text-slate-400 text-center py-6">No order data available</p>;

  const R = 36, C_XY = 44, circ = 2 * Math.PI * R;
  const slices = data.reduce((acc, d) => {
    const pct = d.value / total;
    const dash = pct * circ;
    const gap = circ - dash;
    const o = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
    return [...acc, { ...d, dash, gap, offset: o }];
  }, []);

  return (
    <div className="flex items-center gap-6 py-2">
      <div className="relative shrink-0 w-24 h-24 flex items-center justify-center">
        <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
          <circle cx={C_XY} cy={C_XY} r={R} fill="none" stroke="#f1f5f9" strokeWidth="10" />
          {slices.map((s, i) => (
            <circle key={i} cx={C_XY} cy={C_XY} r={R} fill="none"
              stroke={s.color} strokeWidth="10"
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-s.offset}
              className="transition-all duration-700 ease-out"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-base font-extrabold text-slate-900 leading-none">{total}</span>
          <span className="text-[9px] font-bold text-slate-400 tracking-wider mt-0.5">TOTAL</span>
        </div>
      </div>
      
      <div className="space-y-2 flex-1">
        {data.map(s => (
          <div key={s.label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
              <span className="text-slate-500 font-medium capitalize">{s.label}</span>
            </div>
            <span className="font-semibold text-slate-800">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Revenue Sparkline Path ───────────────────────────────────────────────────
function Sparkline({ points = [], color = "#f59e0b" }) {
  if (points.length < 2) return null;
  const W = 220, H = 52, pad = 4;
  const max = Math.max(...points, 1);
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (W - pad * 2));
  const ys = points.map(v => H - pad - ((v / max) * (H - pad * 2)));
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const fill = `${d} L${xs[xs.length-1]},${H} L${xs[0]},${H} Z`;
  return (
    <svg width={W} height={H} className="overflow-visible">
      <defs>
        <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#sparkGradient)" />
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Main Console Dashboard ──────────────────────────────────────
export default function Dashboard() {
  const [products,  setProducts]  = useState([]);
  const [orders,    setOrders]    = useState([]);
  const [users,     setUsers]     = useState([]);
  const [loading,   setLoading]   = useState({ products: true, orders: true, users: true, banners: true });

  const setDone = (key) => setLoading(l => ({ ...l, [key]: false }));

  useEffect(() => {
    // Products table query remains public
    axios.get(`${API_URL}/products/`).then(r => setProducts(r.data)).catch(console.error).finally(() => setDone("products"));
    
    // FIXED: Appended authorized headers wrapper to securely execute order tracking lookups
    axios.get(`${API_URL}/orders/all`, getAuthHeaders()).then(r => setOrders(r.data)).catch(console.error).finally(() => setDone("orders"));
    
    // FIXED: Appended authorized headers wrapper to securely query user register logs
    axios.get(`${API_URL}/users`, getAuthHeaders()).then(r => setUsers(r.data?.data || r.data || [])).catch(console.error).finally(() => setDone("users"));
    
    axios.get(`${API_URL}/banners`, getAuthHeaders()).then(r => { /* logical placeholder matching original schema execution */ }).catch(console.error).finally(() => setDone("banners"));
  }, []);

  const stats = useMemo(() => {
    const featuredItems = products.filter(p => p.is_featured).length;
    const lowStock = products.filter(
      (p) => Number(p.stock_quantity) <= 5 && Number(p.stock_quantity) > 0,
    );
    const outOfStock = products.filter((p) => Number(p.stock_quantity) === 0).length;
    const latestItems = [...products].sort((a, b) => b.id - a.id).slice(0, 4);

    const categoriesMap = {};
    products.forEach((p) => {
      const catName = p.category?.name || "Unassigned";
      categoriesMap[catName] = (categoriesMap[catName] || 0) + 1;
    });
    const categoriesArray = Object.entries(categoriesMap).sort((a, b) => b[1] - a[1]);

    return { featured: featuredItems, lowStock, outOfStock, latest: latestItems, categories: categoriesArray };
  }, [products]);

  const orderStats = useMemo(() => {
    const byStatus = (s) => orders.filter(o => o.status?.toLowerCase() === s).length;
    const revenue = orders
      .filter(o => o.status?.toLowerCase() === "delivered")
      .reduce((s, o) => s + (Number(o.total_amount) || 0), 0);

    const todayStr = new Date().toDateString();
    const todayRev = orders
      .filter(o => o.status?.toLowerCase() === "delivered" && new Date(o.created_at).toDateString() === todayStr)
      .reduce((s, o) => s + (Number(o.total_amount) || 0), 0);

    const recent = [...orders].sort((a, b) => b.id - a.id).slice(0, 6);

    const monthlyMap = {};
    orders.forEach(o => {
      if (o.status?.toLowerCase() !== "delivered") return;
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + Number(o.total_amount || 0);
    });
    const sparkPoints = Object.values(monthlyMap).slice(-6);

    const statusDistrib = [
      { label: "Delivered",  value: byStatus("delivered"),  color: "#059669" },
      { label: "Pending",    value: byStatus("pending"),    color: "#d97706" },
      { label: "Processing", value: byStatus("processing"), color: "#7c3aed" },
      { label: "Shipped",    value: byStatus("shipped"),    color: "#0284c7" },
      { label: "Cancelled",  value: byStatus("cancelled"),  color: "#dc2626" },
    ].filter(s => s.value > 0);

    return {
      total: orders.length,
      pending: byStatus("pending"),
      processing: byStatus("processing"),
      delivered: byStatus("delivered"),
      cancelled: byStatus("cancelled"),
      revenue, todayRev, recent, sparkPoints, statusDistrib,
    };
  }, [orders]);

  const userStats = useMemo(() => {
    const normalized = users.map(u => ({ ...u, role: u.role || "user" }));
    return { total: normalized.length };
  }, [users]);

  const kpiCards = [
    { label: "Total Perfumes", value: fmt(products.length), sub: `${stats.featured} featured items`, subColorClass: "text-violet-600", icon: "🧴", loading: loading.products },
    { label: "Total Orders", value: fmt(orderStats.total), sub: `↑ ${orderStats.pending} pending checkout`, subColorClass: "text-amber-700", icon: "🛒", loading: loading.orders },
    { label: "Revenue Generated", value: fmtRupee(orderStats.revenue), sub: `Today: ${fmtRupee(orderStats.todayRev)}`, subColorClass: "text-emerald-600", icon: "✨", loading: loading.orders },
    { label: "Low Stock Items", value: fmt(stats.lowStock.length), sub: stats.lowStock.length > 0 ? "⚠️ Needs manual restock" : "All variants safe", subColorClass: stats.lowStock.length > 0 ? "text-red-600 font-bold" : "text-slate-500", icon: "📦", danger: stats.lowStock.length > 0, loading: loading.products },
  ];

  const formattedToday = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 antialiased font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ══ HEADER ══ */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-violet-600 to-fuchsia-600" />
              <p className="text-[10px] uppercase tracking-widest font-bold text-violet-600">Lumière Suite</p>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Console Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">{formattedToday}</p>
          </div>

          <div className="flex gap-2.5 items-center flex-wrap">
            <a href="/admin/products" className="text-xs font-semibold px-4 py-2.5 rounded-lg bg-slate-900 text-white shadow-sm hover:bg-slate-800 transition-all border-0">
              + Add Product
            </a>
            <a href="/admin/banner" className="text-xs font-semibold px-4 py-2.5 rounded-lg bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
              + Add Banner
            </a>
            <a href="/admin/orders" className="text-xs font-semibold px-4 py-2.5 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 transition-all">
              View Orders
            </a>
          </div>
        </div>

        {/* ══ KPI SECTIONS ══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map(card => <KpiCard key={card.label} {...card} />)}
        </div>

        {/* ══ REVENUE TREND CHART BANNER ══ */}
        {orderStats.sparkPoints.length > 1 && (
          <div className="rounded-2xl p-6 bg-slate-900 border border-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Aggregated Revenue Trend</p>
              <p className="text-3xl font-extrabold text-white mt-1.5 tracking-tight">{fmtRupee(orderStats.revenue)}</p>
              <p className="text-xs text-slate-400 mt-1">Lifecycle analytics across all successful processed deliveries</p>
            </div>
            <div className="opacity-90 max-w-full overflow-x-auto py-1">
              <Sparkline points={orderStats.sparkPoints} color="#a78bfa" />
            </div>
            <div className="grid grid-cols-3 gap-6 border-l border-slate-800 pl-6 shrink-0">
              {[
                { label: "Delivered", val: orderStats.delivered, text: "text-emerald-400" },
                { label: "Processing", val: orderStats.processing, text: "text-violet-400" },
                { label: "Cancelled", val: orderStats.cancelled, text: "text-red-400" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-xl font-extrabold text-white">{s.val}</p>
                  <p className={`text-[9px] uppercase font-bold tracking-wider ${s.text}`}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TWO-COLUMN ACTION CONTENT ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Orders Listing Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
              <span className="text-xs font-semibold text-slate-400">Realtime logs</span>
            </div>

            {loading.orders ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : orderStats.recent.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <span className="text-2xl block mb-2">📦</span>
                <p className="text-xs">No transactions have been recorded yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold text-left">
                      <th className="pb-3 font-medium">Customer Handle</th>
                      <th className="pb-3 font-medium">Product Matrix</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status Flag</th>
                      <th className="pb-3 font-medium">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orderStats.recent.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-3.5 font-medium text-slate-700 truncate max-w-[120px]">{order.users?.email?.split("@")[0] || "—"}</td>
                        <td className="py-3.5 text-slate-500 truncate max-w-[160px]">{order.order_items?.[0]?.products?.name || "—"}</td>
                        <td className="py-3.5 font-bold text-slate-900">{fmtRupee(order.total_amount)}</td>
                        <td className="py-3.5"><StatusBadge status={order.status} /></td>
                        <td className="py-3.5 text-slate-400">{fmtDate(order.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Low Stock Watchlist */}
          <div className={`bg-white rounded-xl border p-6 shadow-sm ${stats.lowStock.length > 0 ? "border-red-100 bg-red-50/5" : "border-slate-200/80"}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-900">Inventory Monitoring</h3>
              {stats.lowStock.length > 0 && (
                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                  {stats.lowStock.length} Alerts
                </span>
              )}
            </div>

            {loading.products ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : stats.lowStock.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <span className="text-2xl block mb-2">✨</span>
                <p className="text-xs">All individual items reflect adequate runtime health</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.lowStock.map(p => (
                  <MiniBar
                    key={p.id}
                    label={p.name}
                    value={Number(p.stock_quantity)}
                    max={25}
                    tailwindBg={Number(p.stock_quantity) <= 3 ? "bg-red-600" : "bg-amber-500"}
                  />
                ))}
              </div>
            )}

            {stats.outOfStock > 0 && (
              <div className="mt-5 rounded-lg bg-red-50 text-red-700 border border-red-100 p-3 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                <span>Critical Event: {stats.outOfStock} items completely unfulfilled</span>
              </div>
            )}
          </div>
        </div>

        {/* ══ THREE-COLUMN SUPPLEMENTAL SUMMARY ══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* New Additions */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm md:col-span-2">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Catalog Registry Insights</h3>
            {loading.products ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : stats.latest.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No catalog definitions tracked</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stats.latest.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 bg-slate-50/40">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white border border-slate-100 flex items-center justify-center shadow-inner">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg text-slate-400">🧴</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate m-0">{p.name}</p>
                      <p className="text-[11px] text-slate-400 truncate m-0">{p.brand || "Lumière"} · <span className="font-semibold text-slate-700">{fmtRupee(p.discount_price || p.price)}</span></p>
                    </div>
                    {p.is_featured && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 shrink-0">STAR</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metrics Distribution Chart Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Volume Allocation</h3>
            {loading.orders ? (
              <Skeleton className="h-28 w-full" />
            ) : (
              <StatusDonut data={orderStats.statusDistrib} />
            )}
          </div>
        </div>

        {/* ══ DENSITY MATRIX CATEGORIES ══ */}
        {stats.categories.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Distribution by Category Matrix</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              {stats.categories.map(([name, count], i) => {
                const twColors = ["bg-violet-600", "bg-amber-500", "bg-emerald-600", "bg-sky-500", "bg-rose-500", "bg-indigo-600"];
                return (
                  <MiniBar
                    key={name}
                    label={name}
                    value={count}
                    max={products.length}
                    tailwindBg={twColors[i % twColors.length]}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ══ CONSOLE SYSTEM FOOTER ══ */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/60 pt-6 text-[10px] font-bold tracking-wider text-slate-400 uppercase gap-2">
          <p>Lumière Engine v2.4.0 · Admin Infrastructure</p>
          <p>{products.length} Registry Units · {orders.length} Handled Orders · {userStats.total} Profiles</p>
        </div>

      </div>
    </div>
  );
}