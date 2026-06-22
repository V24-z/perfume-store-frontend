import { CheckCircle, ShoppingBag} from "lucide-react";
import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">

        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        {/* Message */}
        <p className="mt-3 text-gray-600 leading-relaxed">
          Thank you for your purchase. Your order has been confirmed and is
          being processed. You will receive an email confirmation shortly.
        </p>

        {/* Order Info Card */}
        <div className="mt-6 bg-gray-50 rounded-2xl p-5 border">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Order Status</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Confirmed
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-gray-500">Estimated Delivery</span>
            <span className="font-semibold text-gray-800">
              3 - 5 Business Days
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button className="flex-1 bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition duration-300 flex items-center justify-center gap-2">
            <ShoppingBag size={18} />
            <Link to="/shop">
            Continue Shopping</Link>
          </button>

          
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-sm text-gray-400">
          Need help? Contact our support team anytime.
        </p>
      </div>
    </div>
  );
}

export default OrderSuccess;