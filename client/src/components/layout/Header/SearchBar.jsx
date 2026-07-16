import {Search} from "lucide-react"

export default function SearchBar () {
    return(
        <div className="relative w-full max-w-3xl">
            
            {/* Icon */}
            <Search 
                size={18} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" 
            />

            {/* Input Field */}
            <input
                type="text"
                placeholder="Search builds, components, orders..."
                className="
                    w-full
                    rounded-xl
                    border
                    border-zinc-800
                    bg-[#121821]
                    py-3
                    pl-12
                    pr-4
                    text-sm
                    text-white
                    outline-none
                    transition-all
                    duration-300
                    placeholder:text-zinc-500
                    focus:border-cyan-400
                    focus:ring-2
                    focus:ring-cyan-400/20"
            />
        </div>
    );
}