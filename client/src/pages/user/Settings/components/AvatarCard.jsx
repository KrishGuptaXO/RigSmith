import { Check } from "lucide-react";

export default function AvatarCard ({avatar, selected, onSelected}) {
    return (
        <button 
            onClick={() => onSelect(avatar)} 
            className = {`
                group 
                relative 
                aspect-square
                overflow-hidden 
                rounded-2xl 
                border-2 
                transition-all 
                duration-300 
                cursor-pointer 
                ${selected 
                    ? "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                    : "border-zinc-700 hover:border-cyan-400 hover:scale-105"
                 }`
            }>
                <img src={avatar.image} alt={avatar.name} className="h-full w-full object-cover" draggable={false} />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
                
                {/* Selected Checkmark */}
                {selected && (
                    <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400 text-black">
                        <Check size={18} />
                    </div>
                )}
        </button>
    );
}