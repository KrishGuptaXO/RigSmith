import { ShieldCheck, Smartphone, Monitor, Clock } from "lucide-react";
import Button from "../../../../components/common/Button";

export default function SecuritySection() {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-[#111827] p-8">

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white">
                    Security
                </h2>

                <p className="mt-2 text-zinc-400">
                    Manage your account security and connected devices.
                </p>
            </div>

            {/* 2FA */}
            <div className="mb-6 rounded-xl border border-zinc-700 bg-[#0F141D] p-5">
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <ShieldCheck size={24} className="mt-1 text-cyan-400" />
                        
                        <div>
                            <h3 className="font-semibold text-white">
                                Two-Factor Authentication
                            </h3>

                            <p className="mt-1 text-sm text-zinc-400">
                                Add an extra layer of security to your account.
                            </p>
                        </div>
                    </div>
                    
                    <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-400">
                        Coming Soon
                    </span>

                </div>
            </div>

            {/* Current Session */}
            <div className="mb-6 rounded-xl border border-zinc-700 bg-[#0F141D] p-5">
                <div className="mb-4 flex items-center gap-3">
                    <Monitor size={20} className="text-cyan-400" />
                    <h3 className="font-semibold text-white">
                        Current Session
                    </h3>
                </div>
                
                <p className="text-zinc-400">
                    Windows 11 • Chrome • Delhi
                </p>

                <p className="mt-1 text-sm text-green-400">
                    Active Now
                </p>

            </div>

            {/* Login History */}
            <div className="mb-6 rounded-xl border border-zinc-700 bg-[#0F141D] p-5">
                <div className="mb-4 flex items-center gap-3">
                    <Clock size={20} className="text-cyan-400" />
                    <h3 className="font-semibold text-white">
                        Recent Login Activity
                    </h3>
                </div>
                <div className="space-y-4">
                    <LoginItem location="Delhi" device="Chrome • Windows" time="Today, 9:42 AM" />
                    <LoginItem location="Noida" device="Edge • Windows" time="Yesterday, 8:15 PM" />
                </div>
            </div>

            {/* Connected Devices */}
            <div className="rounded-xl border border-zinc-700 bg-[#0F141D] p-5">
                <div className="mb-4 flex items-center gap-3">
                    <Smartphone size={20} className="text-cyan-400" />

                    <h3 className="font-semibold text-white">
                        Connected Devices
                    </h3>
                </div>
                <div className="space-y-3">
                    <DeviceItem name="Android Phone" />
                </div>
                
                <div className="mt-6 flex justify-end">
                    <Button>
                        Sign Out Other Devices
                    </Button>
                </div>
            </div>
        </div>
    );
}

function LoginItem ({location, device, time}) {
    return (
        <div className="flex justify-between border-b border-zinc-800 pb-3 last:border-none">
            <div>
                <p className="font-medium text-white">
                    {location}
                </p>

                <p className="text-sm text-zinc-500">
                    {device}
                </p>
            </div>
            <p className="text-sm text-zinc-400">
                {time}
            </p>
        </div>
    );
}

function DeviceItem({name, active=false}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-white">
                {name}
            </span>

            {active && (
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                    Current Device
                </span>
            )}
        </div>
    );
}