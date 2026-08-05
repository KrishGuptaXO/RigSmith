import notifications from "../../../data/notification";
import NotificationItem from "./NotificationItem";

export default function NotificationDropdown() {
    return (
        <div className="absolute right-7 top-0 animate-in fade-in zoom-in-95 duration-200 z-50 w-95 overflow-hidden rounded-2xl border border-zinc-800 bg-[#111827] shadow-[0,0,0,0.35]">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                <div>
                    <h2 className="font-semibold text-white">
                        Notifications
                    </h2>

                    <p className="text-sm text-zinc-500">
                        {notifications.length} notifications
                    </p>
                </div>

                <button className="text-sm text-cyan-400 transition-color hover:text-cyan-300 cursor-pointer">
                    Mark all read
                </button>
            </div>

            {/* Notifications */}
            <div className="max-h-105 overflow-y-auto">
                {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                ))}
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-800 p-4">
                <button className="w-full rounded-xl border border-cyan-400 py-3 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-400/10 cursor-pointer">
                    View All Notifications
                </button>

            </div>
        </div>
    );
}