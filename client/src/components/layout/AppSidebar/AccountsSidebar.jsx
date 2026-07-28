import { UserRound, ChevronRight } from "lucide-react";
import account from "./accountData";

export default function AccountsSidebar({collapsed}) {
    if (collapsed) {
        return (
            <button className="
                group relative 
                flex items-center justify-center
                h-12 w-12
                text-zinc-400
                rounded-xl
                transition-all
                hover:bg-[#191528] hover:text-cyan-400
                cursor-pointer
            ">
                <UserRound size={22} />
                <div className="
                    pointer-events-none
                    absolute
                    left-16 top-1/2 -translate-y-1/2
                    whitespace-nowrap
                    rounded-lg
                    border border-[#2A3240] bg-[#22252D]
                    px-4 py-2
                    text-sm font-medium text-white
                    opacity-0 translate-x-2
                    transition-all duration-200
                    group-hover:opacity-100 group-hover:translate-x-0
                ">
                    {account.loggedIn ? account.name : "Sign In"}
                </div>
            </button>  
        );
    }

    return (
        <button className="
            flex items-center
            w-full gap-3
            rounded-xl
            px-4 py-3
            transition-all
            hover:bg-[#191528]
            cursor-pointer
        ">
            <div className="
                flex items-center justify-center
                h-11 w-11
                rounded-full
                text-cyan-400
            ">
                <UserRound size={20} />
            </div>
            
            <div className="flex-1 text-left">
                <p className="font-medium text-white">
                    {account.loggedIn ? account.name : "Guest"}
                </p>

                <p>
                    {account.loggedIn
                    ? account.email
                    : "Click to Sign In"
                    }
                </p>
            </div>

            <ChevronRight size={18} className="text-zinc-500" />
        </button>
    );
}