import { useState, useMemo, useEffect } from "react";
import { Search, PackageOpen, LoaderCircle } from "lucide-react";
import FilterDropdown from "./orders/FilterDropdown";
import ActiveOrderCard from "./orders/ActiveOrderCard";
import PastOrderCard from "./orders/PastOrderCard";
import authStore from "../../store/authStore";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api/orders";

const ACTIVE_STATUSES = ["pending", "confirmed", "processing", "shipped"];
const PAST_STATUSES = ["delivered", "cancelled"];

/** Returns true if the order falls within the selected time filter window */
function withinTimeFilter (order, time) {
    const now = new Date();
    const ref = new Date(order.createdAt);
    const diffDays = (now - ref) / (1000 * 60 * 60 * 24);

    if (time === "7d") return diffDays <= 7;
    if (time === "1m") return diffDays <= 30;
    if (time === "3m") return diffDays <= 90;
    
    return true;
}

/** Returns true if the order matches the shipping filter */
function matchesStatusFilter(order, status) {
    if (status === "all") return true;

    return order.status === status;
}

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState({ time: "3m", status: "all" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async() => {
            const token = authStore.getState().token;

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch (API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load orders.");
                }

                setOrders(Array.isArray(data) ? data : data.orders || []);
            } catch (error) {
                console.error("Failed to fetch orders: ", error);
                toast.error(error.message || "Failed to load errors.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        return orders.filter((order) => {
            const matchesSearch =
                !q ||
                order._id.toLowerCase().includes(q) ||
                order.items.some((item) =>
                    item.name.toLowerCase().includes(q)
                );

            return (
                matchesSearch &&
                withinTimeFilter(order, filters.time) &&
                matchesStatusFilter(order, filters.status)
            );
        });
    }, [orders, query, filters]);

    const activeOrders = filtered.filter((order) => ACTIVE_STATUSES.includes(order.status));

    const pastOrders = filtered.filter((order) => PAST_STATUSES.includes(order.status));

    const hasAny = filtered.length > 0;

    if (loading) {
        return (
            <section className="max-w-6xl mx-auto pb-16">
                <div className="flex items-center justify-center py-32">
                    <LoaderCircle
                        size={28}
                        className="text-cyan-400 animate-spin"
                    />
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-6 pb-16 max-w-6xl mx-auto">

            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Your Orders
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                    Track and manage your RigSmith builds.
                </p>
            </div>

            {/* Search + Filter */}
            <div className="flex items-center gap-3">

                {/* Search */}
                <div className="relative flex-1">
                    <Search
                        size={15}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for your Orders..."
                        className="w-full rounded-xl border border-[#2a2a3e] bg-[#0f0f18] pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/10 transition-all duration-200"
                    />
                </div>

                <FilterDropdown
                    filters={filters}
                    onChange={setFilters}
                />
            </div>

            {/* Empty State */}
            {!hasAny && (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                    <div className="w-14 h-14 rounded-full border border-[#2a2a3e] bg-[#0f0f18] flex items-center justify-center">
                        <PackageOpen
                            size={26}
                            className="text-gray-600"
                        />
                    </div>

                    <div>
                        <p className="text-gray-300 font-semibold text-sm">
                            No orders found
                        </p>

                        <p className="text-gray-600 text-xs mt-1">
                            Try adjusting your search or filters.
                        </p>
                    </div>
                </div>
            )}

            {/* Active Orders */}
            {activeOrders.length > 0 && (
                <div className="space-y-3">
                    <div>
                        <h2 className="text-white font-bold text-lg">
                            Purchase History
                        </h2>

                        <p className="text-gray-500 text-xs mt-0.5">
                            Past three months &nbsp;·&nbsp; Orders to be
                            shipped / picked up
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#1e1e2e] overflow-hidden divide-y divide-[#1e1e2e]">
                        {activeOrders.map((order) => (
                            <ActiveOrderCard
                                key={order._id}
                                order={order}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Past Orders */}
            {pastOrders.length > 0 && (
                <div className="space-y-3">
                    <div>
                        <h2 className="text-gray-400 font-semibold text-sm">
                            Past Orders
                            <span className="text-gray-600 font-normal">
                                {" "}
                                (up to 3 months old)
                            </span>
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-[#1e1e2e] overflow-hidden divide-y divide-[#1e1e2e]">
                        {pastOrders.map((order) => (
                            <PastOrderCard
                                key={order._id}
                                order={order}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}