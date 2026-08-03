import { Camera, Package, Heart, Wrench, ShieldCheck, Shield } from "lucide-react";
import Av1 from "../../../../assets/images/Avatars/Avatar1.png"
import AvatarModals from "./AvatarModal";
import { useState } from "react";

export default function ProfileCard() {
    const [showAvatarModal, setShowAvatarModal] = useState(0);
    return (
        <div className="rounded-2xl border border-zinc-800 bg-[#111827] overflow-hidden">
            
            {/* Avatar Selection */}
            <div className="flex flex-col items-center px-8 pt-8">
                <div className="relative">
                    
                    <img
                        src={Av1}
                        alt="Profile"
                        className="h-32 w-32 rounded-full border-4 border-[#111827] object-cover"
                    />

                    <button 
                        onClick={() => setShowAvatarModal(true)}
                        className="absolute bottom-1 right-1 rounded-full bg-cyan-500 p-2 text-black transition duration-200 hover:scale-110 cursor-pointer">
                        <Camera size={16} />
                    </button>

                </div>
                
                <h2 className="mt-5 text-2xl font-semibold text-white">
                    Krish Gupta
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                    Customer
                </p>
            </div>
            <AvatarModals open={showAvatarModal} onClose={() => setShowAvatarModal(0)} />

            {/* Divider */}
            <div className="my-6 border-t border-zinc-800" />

            {/* Stats */}
            <div className="space-y-4 px-8">
                
                <Stat
                    icon = {<Package size={18} />}
                    title="Orders"
                    value="12"
                />
                
                <Stat
                    icon = {<Wrench size={18} />}
                    title="Saved Builds"
                    value="6"
                />
                
                <Stat
                    icon = {<Heart size={18} />}
                    title="Wishlist"
                    value="3"
                />

            </div>
            
            {/* Divider */}
            <div className="my-6 border-t border-zinc-800" />

            {/* Membership */}
            <div className="flex items-center gap-3 px-8 pb-8">
                <ShieldCheck className="text-cyan-400" size={20} />
                
                <div>

                    <p className="text-sm text-zinc-400">
                        Member Since:
                    </p>
                    
                    <p className="text-white">
                        July 2026
                    </p>
                </div>
            </div>
        </div>
    );
}

function Stat({icon, title, value}){
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-zinc-400">
                
                {icon}
                
                <span> {title} </span>

            </div>

            <span className="font-semibold text-white"> {value} </span>
        </div>
    );
}