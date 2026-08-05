import { Search } from "lucide-react";

export default function InventorySearch ({value, onChange}) {
    return (
        <div className="relative">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
                value={value}
                onChange={onChange}
                type="text" 
                placeholder="Search components, brands..." 
                className="
                w-full 
                rounded-2xl 
                border border-[#2A3240]
                py-4 pl-14 pr-5
                text-white
                outline-none
                transition-all duration-300
                placeholder:text-zinc-500
                focus:border-cyan-400
                focus:ring-2
                focus:ring-cyan-400/20" 
            />

        </div>
    );
}