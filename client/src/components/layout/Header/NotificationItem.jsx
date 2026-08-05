export default function NotificationItem ({notification}) {
    const Icon = notification.icon;

    return (
        <button className="group flex w-full items-start gap-4 rounded-xl px-4 py-3 text-left transition-all duration-200 hover:bg-[#191528] cursor-pointer">
            
            {/* Icon */}
            <div className={`mt-1 rounded-lg bg-[#111827] p-2 ${notification.color}`}>
                <Icon size={18} />
            </div>

            {/* Text */}
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="font-medium text-white">
                        {notification.title}
                    </p>

                    {notification.unread && (
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    )}

                </div>

                <p className="mt-1 text-sm text-zinc-500">
                    {notification.time}
                </p>

            </div>
        </button>
    );
}