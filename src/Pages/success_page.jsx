import { CheckCircle, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
function OrderSuccess() {
   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 antialiased font-sans flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 text-center shadow-sm">

        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-emerald-50 border border-emerald-100/60 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
            <CheckCircle className="w-11 h-11" strokeWidth={1.8} />
          </div>
        </div>

        {/* Brand context mark */}
        <div className="flex items-center justify-center gap-1.5 mt-6 mb-1">
          <span className="w-1.5 h-3.5 rounded-full bg-gradient-to-b from-violet-600 to-fuchsia-600" />
          <p className="text-[10px] uppercase tracking-widest font-bold text-violet-600">Lumière Maison</p>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black tracking-tight text-[#1a0533]">
          Order Placed Successfully!
        </h1>

        {/* Message */}
        <p className="mt-2.5 text-xs font-medium text-slate-400 max-w-sm mx-auto leading-relaxed">
          Thank you for your purchase. Your order has been confirmed and is
          being processed. You will receive an email confirmation shortly.
        </p>

        {/* Order Info Card */}
        <div className="mt-6 bg-slate-50/60 rounded-2xl p-4 border border-slate-100 text-xs font-medium text-slate-500 space-y-3">
          

          <div className="flex items-center justify-between">
            <span>Estimated Delivery</span>
            <span className="font-bold text-slate-800">
              3 - 5 Business Days
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link 
            to="/shop" 
            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider no-underline border-0 hover:bg-slate-800 shadow-sm active:scale-95 transition-all"
          >
            <ShoppingBag size={14} />
            Continue Shopping
          </Link>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Need help? Contact our support team anytime.
        </p>
      </div>
    </div>
  );
}

export default OrderSuccess;