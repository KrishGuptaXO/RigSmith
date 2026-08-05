import { Home } from "lucide-react";
import Button from "../../../../components/common/Button";

export default function AddressSection() {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-[#111827] p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-white">
                        Saved Addresses
                    </h2>

                    <p className="mt-2 text-zinc-400">
                        Manage your delivery addresses.
                    </p>
                </div>

                <Button>
                    + Add address
                </Button>
            </div>

            <div className="space-y-5">
                <AddressCard title="Home" address="221B Baker Street, London" phone="+91 9876543210" isDefault />
                <AddressCard title="Office" address="Sector-62 Noide" phone="+91 9123456789" />
            </div>
        </div>
    );
}

function AddressCard({title, address, phone, isDefault=false}) {
    return (
        <div className="rounded-xl border border-zinc-700 bg-[#0F141D] p-5">
            <div className="flex justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Home size={18} className="text-cyan-400" />
                        <h3 className="font-semibold text-white"> {title} </h3>
                        {isDefault && (
                            <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-400">
                                Default
                            </span>
                        )}
                    </div>
                    
                    <p className="mt-3 text-zinc-400">
                        {address}
                    </p>
                    
                    <p className="mt-1 text-zinc-500">
                        {phone}
                    </p>
                </div>
            

                <div className="flex gap-2">
                    <button className="text-sm text-cyan-400 hover:underline cursor-pointer">
                        Edit
                    </button>

                    <button className="text-sm text-red-400 hover:underline cursor-pointer">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}