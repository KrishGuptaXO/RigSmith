import { Camera, Package, Heart, Wrench, ShieldCheck } from "lucide-react";
import { useState } from "react";
import Avatar from "../../../../data/Avatars";
import AvatarModal from "./AvatarModal";
import authStore from "../../../../store/authStore";

export default function ProfileCard() {
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    const user = authStore((state) => state.user);
    const updateUser = authStore((state) => state.updateUser);

    const avatar =
        Avatar.find((item) => item.id === user?.avatarId) ?? Avatar[0];

    const handleAvatarSave = (updatedUser) => {
        updateUser(updatedUser);
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111827]">
            <div className="flex flex-col items-center px-8 pt-8">
                <div className="relative">
                    <img
                        src={avatar.image}
                        alt="Profile avatar"
                        className="h-32 w-32 rounded-full border-4 border-[#111827] object-cover"
                    />

                    <button
                        type="button"
                        onClick={() => setShowAvatarModal(true)}
                        aria-label="Change profile avatar"
                        className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-cyan-500 p-2 text-black transition duration-200 hover:scale-110"
                    >
                        <Camera size={16} />
                    </button>
                </div>

                <h2 className="mt-5 text-2xl font-semibold text-white">
                    {user?.name ?? "Customer"}
                </h2>

                <p className="mt-1 text-sm capitalize text-zinc-400">
                    {user?.role ?? "Customer"}
                </p>
            </div>

            <AvatarModal
                open={showAvatarModal}
                onClose={() => setShowAvatarModal(false)}
                avatarId={avatar.id}
                onSave={handleAvatarSave}
            />

            <div className="my-6 border-t border-zinc-800" />

            <div className="space-y-4 px-8">
                <Stat icon={<Package size={18} />} title="Orders" value="12" />
                <Stat icon={<Wrench size={18} />} title="Saved Builds" value="6" />
                <Stat icon={<Heart size={18} />} title="Wishlist" value="3" />
            </div>

            <div className="my-6 border-t border-zinc-800" />

            <div className="flex items-center gap-3 px-8 pb-8">
                <ShieldCheck className="text-cyan-400" size={20} />

                <div>
                    <p className="text-sm text-zinc-400">Member Since:</p>
                    <p className="text-white">July 2026</p>
                </div>
            </div>
        </div>
    );
}

function Stat({ icon, title, value }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-zinc-400">
                {icon}
                <span>{title}</span>
            </div>

            <span className="font-semibold text-white">{value}</span>
        </div>
    );
}