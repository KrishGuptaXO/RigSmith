import { Bell } from "lucide-react";
import notifications from "../../../data/notification";
import NotificationDropdown from "./NotificationDropdown";
import { useEffect, useRef, useState } from "react";

export default function NotificationButton () {
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(
        (notification) => notification.unread
    ).length;

    useEffect(() => {
        function handleClickOutside (event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            document.removeEventListener (
                "mousedown",
                handleClickOutside
            );
        };
            
    }, []);
    
    return (
        <div ref={dropdownRef} className="relative">
            {/* Bell Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="relative rounded-xl p-2.5 text-zinc-400 transition-all duration-200 hover:bg-[#191528] hover:text-cyan-400 cursor-pointer">
                <Bell size={20} />
                
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-black">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && <NotificationDropdown />}
        </div>
    );
}