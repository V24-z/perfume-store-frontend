import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  ink:     "#1a0533",
  purple:  "#534AB7",
  purpleL: "#eeedfe",
  amber:   "#FF9900",
  amberL:  "#FFF8ED",
  emerald: "#0F6E56",
  emeraldL:"#e1f5ee",
  red:     "#A32D2D",
  redL:    "#fcebeb",
  sky:     "#185FA5",
  skyL:    "#e6f1fb",
  border:  "#f0edf5",
  muted:   "#6B7280",
  bg:      "#F8FAFC",
};

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-IN").format(n ?? 0);
const fmtRupee = (n) => `₹${fmt(n)}`;
const fmtDate  = (s) => s ? new Date(s).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";

function avatarColor(id) {
  const palette = [
    { bg: C.purpleL, fg: C.purple },
    { bg: C.emeraldL, fg: C.emerald },
    { bg: C.skyL,     fg: C.sky     },
    { bg: C.amberL,   fg: "#854F0B" },
    { bg: C.redL,     fg: C.red     },
  ];
  return palette[(parseInt(id) || 0) % palette.length];
}

function initials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
}

// ─── Skeleton block ───────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{ background: "#ede9f4" }}
    />
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  delivered:  { bg: C.emeraldL,  fg: C.emerald },
  shipped:    { bg: C.skyL,      fg: C.sky     },
  pending:    { bg: "#faeeda",   fg: "#854F0B" },
  processing: { bg: C.purpleL,   fg: C.purple  },
  confirmed:  { bg: "#e8f5e9",   fg: "#2e7d32" },
  cancelled:  { bg: C.redL,      fg: C.red     },
};

function StatusBadge({ status = "" }) {
  const s = STATUS_STYLES[status.toLowerCase()] || { bg: "#f3f4f6", fg: C.muted };
  return (
    <span
      className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize"
      style={{ background: s.bg, color: s.fg }}
    >
      {status}
    </span>
  );
}

// ─── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, subColor, iconBg, iconColor, icon, danger, loading }) {
  return (
    <div
      className="bg-white rounded-2xl p-4 flex flex-col gap-3 transition-all hover:shadow-md"
      style={{ border: `1px solid ${danger ? "#fecaca" : C.border}` }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest font-semibold m-0" style={{ color: C.muted }}>{label}</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: iconBg }}>
          <span style={{ color: iconColor, fontSize: 18 }}>{icon}</span>
        </div>
      </div>
      {loading
        ? <Skeleton className="h-7 w-20" />
        : <p className="text-2xl font-bold m-0" style={{ color: danger ? "#dc2626" : C.ink }}>{value}</p>
      }
      <p className="text-[11px] m-0 font-medium" style={{ color: subColor }}>{sub}</p>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHead({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-bold m-0" style={{ color: C.ink }}>{title}</p>
      {action && (
        <button
          onClick={action.fn}
          className="text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer transition-colors"
          style={{ background: C.purpleL, color: C.purple }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ─── Mini bar chart (pure CSS) ────────────────────────────────────────────────
function MiniBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-gray-600 truncate max-w-[140px]">{label}</span>
        <span className="text-[11px] font-bold ml-2 shrink-0" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── Order status donut (SVG) ─────────────────────────────────────────────────
function StatusDonut({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <p className="text-xs text-gray-400 text-center py-4">No order data</p>;

  const R = 36, C_XY = 44, circ = 2 * Math.PI * R;
  const slices = data.reduce((acc, d) => {
    const pct = d.value / total;
    const dash = pct * circ;
    const gap = circ - dash;
    const o = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
    return [...acc, { ...d, dash, gap, offset: o }];
  }, []);

  return (
    <div className="flex items-center gap-5">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx={C_XY} cy={C_XY} r={R} fill="none" stroke="#f0edf5" strokeWidth="12" />
        {slices.map((s, i) => (
          <circle key={i} cx={C_XY} cy={C_XY} r={R} fill="none"
            stroke={s.color} strokeWidth="12"
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={circ / 4 - s.offset}
            style={{ transition: "stroke-dasharray 0.7s ease" }}
          />
        ))}
        <text x={C_XY} y={C_XY} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 13, fontWeight: 800, fill: C.ink }}>
          {total}
        </text>
        <text x={C_XY} y={C_XY + 14} textAnchor="middle"
          style={{ fontSize: 7, fill: C.muted, letterSpacing: 1 }}>
          ORDERS
        </text>
      </svg>
      <div className="space-y-1.5 flex-1">
        {slices.map(s => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
              <span className="text-[11px] text-gray-500 capitalize">{s.label}</span>
            </div>
            <span className="text-[11px] font-bold" style={{ color: C.ink }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Revenue sparkline (SVG path) ─────────────────────────────────────────────
function Sparkline({ points = [], color = C.purple }) {
  if (points.length < 2) return null;
  const W = 200, H = 48, pad = 4;
  const max = Math.max(...points, 1);
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (W - pad * 2));
  const ys = points.map(v => H - pad - ((v / max) * (H - pad * 2)));
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const fill = `${d} L${xs[xs.length-1]},${H} L${xs[0]},${H} Z`;
  return (
    <svg width={W} height={H} className="overflow-visible">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#sg)" />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function LumiereDashboard() {
  const [products,  setProducts]  = useState([]);
  const [orders,    setOrders]    = useState([]);
  const [users,     setUsers]     = useState([]);
  const [banners,   setBanners]   = useState([]);
  const [loading,   setLoading]   = useState({ products: true, orders: true, users: true, banners: true });

  const setDone = (key) => setLoading(l => ({ ...l, [key]: false }));

  useEffect(() => {
    axios.get(`${API_URL}/products/`).then(r => setProducts(r.data)).catch(console.error).finally(() => setDone("products"));
    axios.get(`${API_URL}/orders/all`).then(r => setOrders(r.data)).catch(console.error).finally(() => setDone("orders"));
    axios.get(`${API_URL}/users`).then(r => setUsers(r.data?.data || r.data || [])).catch(console.error).finally(() => setDone("users"));
    axios.get(`${API_URL}/banner`).then(r => setBanners(r.data)).catch(console.error).finally(() => setDone("banners"));
  }, []);

   Object.values(loading).some(Boolean);

  // ── Derived product stats ──
  const stats = useMemo(() => {
    const featured   = products.filter(p => p.is_featured).length;
    const lowStock   = products.filter(p => Number(p.stock_quantity) > 0 && Number(p.stock_quantity) <= 5);
    const outOfStock = products.filter(p => Number(p.stock_quantity) === 0).length;
    const latest     = [...products].sort((a, b) => b.id - a.id).slice(0, 5);

    // category distribution
    const catMap = {};
    products.forEach(p => {
      const cat = p.category?.name || p.category_name || "Other";
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    const categories = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

    return { featured, lowStock, outOfStock, latest, categories };
  }, [products]);

  // ── Derived order stats ──
  const orderStats = useMemo(() => {
    const byStatus = (s) => orders.filter(o => o.status?.toLowerCase() === s).length;
    const revenue = orders
      .filter(o => o.status?.toLowerCase() === "delivered")
      .reduce((s, o) => s + (Number(o.total_amount) || 0), 0);

    const today = new Date().toDateString();
    const todayRev = orders
      .filter(o => o.status?.toLowerCase() === "delivered" && new Date(o.created_at).toDateString() === today)
      .reduce((s, o) => s + (Number(o.total_amount) || 0), 0);

    const recent = [...orders].sort((a, b) => b.id - a.id).slice(0, 6);

    // monthly revenue last 6 months (sparkline points)
    const monthlyMap = {};
    orders.forEach(o => {
      if (o.status?.toLowerCase() !== "delivered") return;
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + Number(o.total_amount || 0);
    });
    const sparkPoints = Object.values(monthlyMap).slice(-6);

    const statusDistrib = [
      { label: "Delivered",  value: byStatus("delivered"),  color: C.emerald },
      { label: "Pending",    value: byStatus("pending"),    color: "#f59e0b" },
      { label: "Processing", value: byStatus("processing"), color: C.purple  },
      { label: "Shipped",    value: byStatus("shipped"),    color: C.sky     },
      { label: "Cancelled",  value: byStatus("cancelled"),  color: "#ef4444" },
    ].filter(s => s.value > 0);

    return {
      total:      orders.length,
      pending:    byStatus("pending"),
      processing: byStatus("processing"),
      delivered:  byStatus("delivered"),
      cancelled:  byStatus("cancelled"),
      revenue, todayRev, recent, sparkPoints, statusDistrib,
    };
  }, [orders]);

  // ── Derived user stats ──
  const [mountTime] = useState(() => Date.now());
  const userStats = useMemo(() => {
    const normalized = users.map(u => ({ ...u, role: u.role || "user" }));
    const admins    = normalized.filter(u => u.role?.toLowerCase() === "admin").length;
    const customers = normalized.length - admins;
    const oneWeekAgo = mountTime - 7 * 86400000;
    const newThisWeek = normalized.filter(u => u.registerd && new Date(u.registerd).getTime() > oneWeekAgo).length;
    const recent = [...normalized].reverse().slice(0, 5);
    return { total: normalized.length, admins, customers, newThisWeek, recent };
  }, [users, mountTime]);

  // ── KPI cards config ──
  const kpiCards = [
    { label: "Total Perfumes",  value: fmt(products.length),      sub: `${stats.featured} featured`,        subColor: C.purple,  iconBg: C.purpleL, iconColor: C.purple,  icon: "🧴", loading: loading.products },
    { label: "Total Orders",    value: fmt(orderStats.total),     sub: `↑ ${orderStats.pending} pending`,   subColor: "#854F0B", iconBg: "#faeeda", iconColor: "#854F0B", icon: "🛒", loading: loading.orders   },
    { label: "Revenue",         value: fmtRupee(orderStats.revenue), sub: `Today: ${fmtRupee(orderStats.todayRev)}`, subColor: C.emerald, iconBg: C.emeraldL, iconColor: C.emerald, icon: "₹", loading: loading.orders },
    { label: "Customers",       value: fmt(userStats.total),      sub: `+${userStats.newThisWeek} this week`, subColor: C.emerald, iconBg: C.skyL, iconColor: C.sky, icon: "👥", loading: loading.users },
    { label: "Featured",        value: fmt(stats.featured),       sub: "products spotlighted",               subColor: C.purple,  iconBg: C.purpleL, iconColor: C.purple,  icon: "⭐", loading: loading.products },
    { label: "Low Stock",       value: fmt(stats.lowStock.length), sub: stats.lowStock.length > 0 ? "⚠ Needs restocking" : "All good", subColor: stats.lowStock.length > 0 ? "#dc2626" : C.emerald, iconBg: "#fee2e2", iconColor: "#dc2626", icon: "⚠", danger: stats.lowStock.length > 0, loading: loading.products },
    { label: "Pending Orders",  value: fmt(orderStats.pending),   sub: "● Awaiting dispatch",                subColor: "#f59e0b", iconBg: "#fef3c7", iconColor: "#d97706", icon: "⏳", loading: loading.orders   },
    { label: "Active Banners",  value: fmt(banners.length),       sub: "banners live",                       subColor: C.sky,     iconBg: C.skyL,    iconColor: C.sky,     icon: "🖼", loading: loading.banners  },
  ];

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-8 py-6 space-y-6">

        {/* ══ PAGE HEADER ══ */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            {/* Brand mark */}
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-6 rounded-full" style={{ background: `linear-gradient(to bottom,${C.amber},${C.purple})` }} />
              <p className="text-[11px] uppercase tracking-[0.2em] font-bold m-0" style={{ color: C.purple }}>Lumière Admin</p>
            </div>
            <h1 className="text-2xl font-bold m-0" style={{ color: C.ink }}>Dashboard</h1>
            <p className="text-xs m-0 mt-0.5" style={{ color: C.muted }}>Welcome back — {today}</p>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "+ Add Product", href: "/admin/products", bg: C.ink,    fg: "#fff" },
              { label: "+ Add Banner",  href: "/admin/banner",  bg: C.purpleL, fg: C.purple },
              { label: "View Orders",   href: "/admin/orders",   bg: C.amberL,  fg: "#854F0B" },
            ].map(btn => (
              <a
                key={btn.label}
                href={btn.href}
                className="text-xs font-bold px-4 py-2.5 rounded-xl no-underline transition-opacity hover:opacity-80"
                style={{ background: btn.bg, color: btn.fg, border: `1px solid ${btn.bg}` }}
              >
                {btn.label}
              </a>
            ))}
          </div>
        </div>

        {/* ══ KPI CARDS ══ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
          {kpiCards.map(card => <KpiCard key={card.label} {...card} />)}
        </div>

        {/* ══ REVENUE SPARKLINE BANNER ══ */}
        {orderStats.sparkPoints.length > 1 && (
          <div
            className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden relative"
            style={{ background: C.ink }}
          >
            {/* Decorative circle */}
            <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-5" style={{ background: C.amber }} />
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold m-0 text-white/50">Revenue trend</p>
              <p className="text-2xl font-bold text-white m-0 mt-1">{fmtRupee(orderStats.revenue)}</p>
              <p className="text-xs text-white/50 m-0 mt-0.5">Delivered orders · all time</p>
            </div>
            <div className="opacity-70">
              <Sparkline points={orderStats.sparkPoints} color={C.amber} />
            </div>
            <div className="flex gap-6">
              {[
                { label: "Delivered",  val: orderStats.delivered  },
                { label: "Processing", val: orderStats.processing },
                { label: "Cancelled",  val: orderStats.cancelled  },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-lg font-bold text-white m-0">{s.val}</p>
                  <p className="text-[10px] text-white/40 m-0 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ MIDDLE ROW: Orders + Low Stock ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Recent Orders (3/5) */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-5" style={{ border: `1px solid ${C.border}` }}>
            <SectionHead title="Recent Orders" action={{ label: "View all", fn: () => {} }} />
            {loading.orders ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : orderStats.recent.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-3xl mb-2">📦</p>
                <p className="text-sm text-gray-400">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                      {["Customer","Product","Amount","Status","Date"].map(h => (
                        <th key={h} className="text-left py-2 pb-3 font-semibold" style={{ color: C.muted }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orderStats.recent.map(order => (
                      <tr
                        key={order.id}
                        style={{ borderBottom: `1px solid #faf7fd` }}
                        className="transition-colors"
                        onMouseEnter={e => e.currentTarget.style.background = "#faf8fd"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td className="py-3 text-gray-700 font-medium">{order.users?.email?.split("@")[0] || "—"}</td>
                        <td className="py-3 text-gray-500">{order.order_items?.[0]?.products?.name || "—"}</td>
                        <td className="py-3 font-semibold" style={{ color: C.ink }}>{fmtRupee(order.total_amount)}</td>
                        <td className="py-3"><StatusBadge status={order.status} /></td>
                        <td className="py-3 text-gray-400">{fmtDate(order.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Low Stock (2/5) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5" style={{ border: `1px solid #fecaca` }}>
            <SectionHead
              title="Low Stock Alerts"
              action={stats.lowStock.length > 0 ? { label: `${stats.lowStock.length} items`, fn: () => {} } : undefined}
            />
            {loading.products ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : stats.lowStock.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-3xl mb-2">✅</p>
                <p className="text-sm text-gray-400">All products well-stocked</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {stats.lowStock.map(p => (
                  <MiniBar
                    key={p.id}
                    label={p.name}
                    value={Number(p.stock_quantity)}
                    max={25}
                    color={Number(p.stock_quantity) <= 3 ? "#ef4444" : "#f59e0b"}
                  />
                ))}
              </div>
            )}
            {stats.outOfStock > 0 && (
              <div className="mt-4 rounded-xl px-3 py-2.5 text-xs font-semibold flex items-center gap-2" style={{ background: "#fcebeb", color: C.red }}>
                <span>●</span> {stats.outOfStock} product{stats.outOfStock > 1 ? "s" : ""} out of stock
              </div>
            )}
          </div>
        </div>

        {/* ══ BOTTOM ROW: Top Products + Users + Banners ══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Top Products */}
          <div className="bg-white rounded-2xl p-5" style={{ border: `1px solid ${C.border}` }}>
            <SectionHead title="Latest Products" />
            {loading.products ? (
              <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : stats.latest.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No products yet</p>
            ) : (
              <div className="space-y-3">
                {stats.latest.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl p-2.5 transition-colors"
                    style={{ background: "#faf8fd" }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                      style={{ background: C.purpleL, color: C.purple }}
                    >
                      {i + 1}
                    </div>
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      {p.image_url
                        ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-xs font-bold" style={{ color: C.purple }}>🧴</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate m-0" style={{ color: C.ink }}>{p.name}</p>
                      <p className="text-[10px] m-0" style={{ color: C.muted }}>{p.brand} · {fmtRupee(p.discount_price || p.price)}</p>
                    </div>
                    {p.is_featured && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded shrink-0" style={{ background: C.amberL, color: "#854F0B" }}>FEAT</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl p-5" style={{ border: `1px solid ${C.border}` }}>
            <SectionHead title="Recent Users" />
            {loading.users ? (
              <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : userStats.recent.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No users yet</p>
            ) : (
              <div className="space-y-2.5">
                {userStats.recent.map((u, i) => {
                  const c = avatarColor(u.id || i);
                  return (
                    <div key={u.id || i} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                        style={{ background: c.bg, color: c.fg }}
                      >
                        {initials(u.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate m-0" style={{ color: C.ink }}>{u.name}</p>
                        <p className="text-[10px] truncate m-0" style={{ color: C.muted }}>{u.email}</p>
                      </div>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 capitalize"
                        style={{
                          background: u.role?.toLowerCase() === "admin" ? C.purpleL : "#f3f4f6",
                          color:      u.role?.toLowerCase() === "admin" ? C.purple  : C.muted,
                        }}
                      >
                        {u.role || "User"}
                      </span>
                    </div>
                  );
                })}
                <div className="pt-2 text-center">
                  <p className="text-[11px]" style={{ color: C.muted }}>
                    <span className="font-bold" style={{ color: C.ink }}>{userStats.customers}</span> customers ·{" "}
                    <span className="font-bold" style={{ color: C.purple }}>{userStats.admins}</span> admins
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Banners + Order Donut */}
          <div className="flex flex-col gap-4">
            {/* Order status donut */}
            <div className="bg-white rounded-2xl p-5 flex-1" style={{ border: `1px solid ${C.border}` }}>
              <SectionHead title="Order Breakdown" />
              {loading.orders
                ? <Skeleton className="h-20 w-full" />
                : <StatusDonut data={orderStats.statusDistrib} />
              }
            </div>

            {/* Banner thumbnails */}
            <div className="bg-white rounded-2xl p-5" style={{ border: `1px solid ${C.border}` }}>
              <SectionHead title="Active Banners" />
              {loading.banners ? (
                <div className="space-y-2">{[...Array(2)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
              ) : banners.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No banners</p>
              ) : (
                <div className="space-y-2">
                  {banners.slice(0, 3).map(b => (
                    <div key={b.id} className="flex items-center gap-3 rounded-xl overflow-hidden" style={{ background: "#faf8fd" }}>
                      <div className="w-14 h-10 shrink-0 overflow-hidden rounded-lg">
                        <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 py-1 pr-2">
                        <p className="text-[11px] font-bold truncate m-0" style={{ color: C.ink }}>{b.title}</p>
                        {b.button_text && (
                          <p className="text-[10px] m-0" style={{ color: C.purple }}>{b.button_text}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {banners.length > 3 && (
                    <p className="text-[10px] text-center" style={{ color: C.muted }}>+{banners.length - 3} more</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══ CATEGORY DISTRIBUTION ══ */}
        {stats.categories.length > 0 && (
          <div className="bg-white rounded-2xl p-5" style={{ border: `1px solid ${C.border}` }}>
            <SectionHead title="Products by Category" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {stats.categories.map(([name, count], i) => {
                const colors = [C.purple, C.amber, C.emerald, C.sky, "#f59e0b", "#ec4899"];
                return (
                  <MiniBar
                    key={name}
                    label={name}
                    value={count}
                    max={products.length}
                    color={colors[i % colors.length]}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ══ FOOTER ══ */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[10px] uppercase tracking-widest font-bold m-0" style={{ color: "#d8d0e8" }}>
            Lumière · Admin Console
          </p>
          <p className="text-[10px] m-0" style={{ color: "#d8d0e8" }}>
            {products.length} products · {orders.length} orders · {userStats.total} users
          </p>
        </div>

      </div>
    </div>
  );
}