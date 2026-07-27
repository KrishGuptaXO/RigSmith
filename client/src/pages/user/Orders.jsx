import { useState, useMemo } from "react";
import { Search, PackageOpen } from "lucide-react";
import orders from "../../data/orders";
import FilterDropdown from "./orders/FilterDropdown";
import ActiveOrderCard from "./orders/ActiveOrderCard";
import PastOrderCard from "./orders/PastOrderCard";

const ACTIVE_STATUSES = ["building", "shipped"];
const PAST_STATUSES = ["delivered", "completed", "cancelled"];

/** Returns true if the order falls within the selected time filter window */
function withinTimeFilter(order, time) {
    const now = new Date();
    const ref = new Date(order.orderedOn);
    const diffDays = (now - ref) / (1000 * 60 * 60 * 24);
    if (time === "7d") return diffDays <= 7;
    if (time === "1m") return diffDays <= 30;
    if (time === "3m") return diffDays <= 90;
    return true;
}

/** Returns true if the order matches the shipping filter */
function matchesShipFilter(order, ship) {
    if (ship === "all") return true;
    const isShipped = order.status === "shipped" || order.status === "delivered" || order.status === "completed";
    return ship === "shipped" ? isShipped : !isShipped;
}

export default function Orders() {
    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState({ time: "3m", ship: "all" });

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return orders.filter((o) => {
            const matchesSearch =
                !q ||
                o.buildName.toLowerCase().includes(q) ||
                o.id.toLowerCase().includes(q);
            return matchesSearch && withinTimeFilter(o, filters.time) && matchesShipFilter(o, filters.ship);
        });
    }, [query, filters]);

    const activeOrders = filtered.filter((o) => ACTIVE_STATUSES.includes(o.status));
    const pastOrders = filtered.filter((o) => PAST_STATUSES.includes(o.status));
    const hasAny = filtered.length > 0;

    return (
        <section className="space-y-6 pb-16 max-w-3xl mx-auto">

            {/* ── Page Header ── */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Your Orders</h1>
                <p className="text-gray-500 text-sm mt-1">Track and manage your RigForge builds.</p>
            </div>

            {/* ── Search + Filter ── */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for your Orders..."
                        className="w-full rounded-xl border border-[#2a2a3e] bg-[#0f0f18] pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/10 transition-all duration-200"
                    />
                </div>

                {/* Filter */}
                <FilterDropdown filters={filters} onChange={setFilters} />
            </div>

            {/* ── Empty State ── */}
            {!hasAny && (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                    <div className="w-14 h-14 rounded-full border border-[#2a2a3e] bg-[#0f0f18] flex items-center justify-center">
                        <PackageOpen size={26} className="text-gray-600" />
                    </div>
                    <div>
                        <p className="text-gray-300 font-semibold text-sm">No orders found</p>
                        <p className="text-gray-600 text-xs mt-1">Try adjusting your search or filters.</p>
                    </div>
                </div>
            )}

            {/* ── Purchase History (Active) ── */}
            {activeOrders.length > 0 && (
                <div className="space-y-3">
                    {/* Section header */}
                    <div>
                        <h2 className="text-white font-bold text-lg">Purchase History</h2>
                        <p className="text-gray-500 text-xs mt-0.5">
                            Past three months &nbsp;·&nbsp; Orders to be shipped / picked up
                        </p>
                    </div>

                    {/* Active order cards */}
                    <div className="rounded-2xl border border-[#1e1e2e] overflow-hidden divide-y divide-[#1e1e2e]">
                        {activeOrders.map((order) => (
                            <ActiveOrderCard key={order.id} order={order} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Past Orders ── */}
            {pastOrders.length > 0 && (
                <div className="space-y-3">
                    {/* Section header */}
                    <div>
                        <h2 className="text-gray-400 font-semibold text-sm">
                            Past Orders
                            <span className="text-gray-600 font-normal"> (up to 3 months old)</span>
                        </h2>
                    </div>

                    {/* Past order cards */}
                    <div className="rounded-2xl border border-[#1e1e2e] overflow-hidden divide-y divide-[#1e1e2e]">
                        {pastOrders.map((order) => (
                            <PastOrderCard key={order.id} order={order} />
                        ))}
                    </div>
                </div>
            )}

        </section>
    );
}