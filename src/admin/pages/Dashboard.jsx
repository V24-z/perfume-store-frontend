const statCards = [
  {
    label: "Total Perfumes",
    value: "48",
    sub: "↑ 4 added this month",
    subColor: "text-emerald-500",
    icon: "ti-droplet",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700",
  },
  {
    label: "Total Orders",
    value: "124",
    sub: "↑ 12% from last month",
    subColor: "text-emerald-500",
    icon: "ti-shopping-cart",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-700",
  },
  {
    label: "Revenue",
    value: "₹84,200",
    sub: "↑ 8% from last month",
    subColor: "text-emerald-500",
    icon: "ti-currency-rupee",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
  {
    label: "Customers",
    value: "312",
    sub: "↑ 18 new this week",
    subColor: "text-emerald-500",
    icon: "ti-users",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-700",
  },
  {
    label: "Low Stock",
    value: "6",
    sub: "⚠ Needs restocking",
    subColor: "text-red-500",
    icon: "ti-alert-triangle",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    danger: true,
  },
  {
    label: "Pending Orders",
    value: "9",
    sub: "● Awaiting dispatch",
    subColor: "text-amber-500",
    icon: "ti-clock",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
  },
];

const recentOrders = [
  { customer: "Priya S.",  product: "Black Orchid", amount: "₹2,400", status: "Delivered", statusStyle: { background: "#e1f5ee", color: "#0F6E56" } },
  { customer: "Arjun M.", product: "Oud Royale",   amount: "₹3,800", status: "Pending",   statusStyle: { background: "#faeeda", color: "#854F0B" } },
  { customer: "Sneha R.", product: "Rose Elixir",  amount: "₹1,950", status: "Shipped",   statusStyle: { background: "#e6f1fb", color: "#185FA5" } },
  { customer: "Rahul K.", product: "Citrus Bloom", amount: "₹1,200", status: "Cancelled", statusStyle: { background: "#fcebeb", color: "#A32D2D" } },
  { customer: "Meena T.", product: "Velvet Musk",  amount: "₹2,100", status: "Delivered", statusStyle: { background: "#e1f5ee", color: "#0F6E56" } },
];

const lowStockItems = [
  { name: "Black Orchid", stock: 3,  max: 25, color: "#ef4444" },
  { name: "Oud Royale",   stock: 7,  max: 25, color: "#f59e0b" },
  { name: "Velvet Musk",  stock: 2,  max: 25, color: "#ef4444" },
  { name: "Rose Elixir",  stock: 9,  max: 25, color: "#f59e0b" },
  { name: "Saffron Noir", stock: 4,  max: 25, color: "#ef4444" },
  { name: "Citrus Bloom", stock: 11, max: 25, color: "#f59e0b" },
];

const topProducts = [
  { name: "Oud Royale",   revenue: "₹18,400", sold: 42 },
  { name: "Black Orchid", revenue: "₹14,200", sold: 31 },
  { name: "Rose Elixir",  revenue: "₹11,700", sold: 27 },
  { name: "Citrus Bloom", revenue: "₹9,900",  sold: 19 },
];

const Dashboard = () => {
  return (
    <div className="space-y-5">

      {/* ── Page title ── */}
      <div>
        <h1 className="text-xl font-bold m-0" style={{ color: "#1a0533" }}>Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5 mb-0">Welcome back! Here's what's happening today.</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {statCards.map(({ label, value, sub, subColor, icon, iconBg, iconColor, danger }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-4"
            style={{ border: danger ? "1px solid #fecaca" : "1px solid #f0edf5" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider m-0 leading-tight">{label}</p>
              <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <i className={`ti ${icon} text-base ${iconColor}`} aria-hidden="true" />
              </div>
            </div>
            <p className="text-2xl font-bold m-0" style={{ color: danger ? "#dc2626" : "#1a0533" }}>{value}</p>
            <p className={`text-[11px] mt-1 m-0 ${subColor}`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Orders + Low Stock ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Recent Orders */}
        <div className="lg:col-span-3 bg-white rounded-xl p-5" style={{ border: "1px solid #f0edf5" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold m-0" style={{ color: "#1a0533" }}>Recent Orders</p>
            <button
              className="text-xs font-medium px-3 py-1 rounded-full transition-colors cursor-pointer border-0"
              style={{ background: "#eeedfe", color: "#534AB7" }}
            >
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid #f0edf5" }}>
                  {["Customer", "Product", "Amount", "Status"].map((h) => (
                    <th key={h} className="text-left py-2 text-gray-400 font-medium pb-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(({ customer, product, amount, status, statusStyle }) => (
                  <tr
                    key={customer}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid #faf7fd" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#faf8fd")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="py-2.5 text-gray-700 font-medium">{customer}</td>
                    <td className="py-2.5 text-gray-500">{product}</td>
                    <td className="py-2.5 font-semibold" style={{ color: "#1a0533" }}>{amount}</td>
                    <td className="py-2.5">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={statusStyle}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5" style={{ border: "1px solid #fecaca" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold m-0" style={{ color: "#1a0533" }}>Low Stock Alerts</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#fcebeb", color: "#A32D2D" }}>
              {lowStockItems.length} items
            </span>
          </div>
          <div className="space-y-3">
            {lowStockItems.map(({ name, stock, max, color }) => (
              <div key={name}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600">{name}</span>
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: stock <= 4 ? "#dc2626" : "#f59e0b" }}
                  >
                    {stock} left
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(stock / max) * 100}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top Selling Products ── */}
      <div className="bg-white rounded-xl p-5" style={{ border: "1px solid #f0edf5" }}>
        <p className="text-sm font-semibold m-0 mb-4" style={{ color: "#1a0533" }}>Top Selling Products</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {topProducts.map(({ name, revenue, sold }, i) => (
            <div
              key={name}
              className="text-center rounded-xl p-4 transition-all cursor-default"
              style={{ background: "#faf8fd", border: "1px solid #f0edf5" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c4bff0")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#f0edf5")}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-2"
                style={{ background: "#eeedfe", color: "#534AB7" }}
              >
                {i + 1}
              </div>
              <p className="text-lg font-bold m-0 mb-1" style={{ color: "#534AB7" }}>{revenue}</p>
              <p className="text-xs text-gray-500 m-0">{name}</p>
              <p className="text-[11px] font-medium mt-1.5 m-0 text-emerald-500">{sold} sold</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;