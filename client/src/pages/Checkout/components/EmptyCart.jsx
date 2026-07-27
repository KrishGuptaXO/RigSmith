import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyCart() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#161B22] border border-[#2a2a3e] flex items-center justify-center">
                <ShoppingBag size={36} className="text-gray-600" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 text-sm">Browse our pre-built systems and add one to get started.</p>
            </div>
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition-all duration-200 cursor-pointer"
            >
                <ArrowLeft size={16} />
                Browse Builds
            </button>
        </div>
    );
}
