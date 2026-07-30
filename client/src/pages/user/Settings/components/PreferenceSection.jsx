import { useState } from "react";

export default function PreferenceSection() {
    const [preferences, setPreferences] = useState({
        orderUpdates: true,
        promotions: false,
        newsletter: true,
        stockAlerts: false,
    });

    const togglePreference = (key) => {
        setPreferences((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className="rounded-2xl border border-zinc-800 bg-[#111827] p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white">
                    Preferences
                </h2>

                <p className="mt-2 text-zinc-400">
                    Customise how RigSmith communicates with you!
                </p>
            </div>

            <div className="space-y-6">
                <PreferenceItem 
                    title="Order Updates" 
                    description="Receive updates about your builds and deliveries."
                    checked={preferences.orderUpdates}
                    onToggle={() => togglePreference("orderUpdates")}
                />

                <PreferenceItem
                    title="Newsletter"
                    description="Stay updated with new features and announcements."
                    checked={preferences.newsletter}
                    onToggle={() => togglePreference("newsletter")}
                />

                <PreferenceItem
                    title="Stock Alerts"
                    description="Notify me when wishlisted components are back in stock."
                    checked={preferences.stockAlerts}
                    onToggle={() => togglePreference("stockAlerts")}
                />
            </div>
        </div>
        
    );
}

function PreferenceItem({title, description, checked, onToggle}) {
    return(
        <div className="flex items-center justify-between rounded-xl border border-zinc-700 bg-[#0F141D] p-5">
            <div>
                <h3 className="font-medium text-white">
                    {title}
                </h3>

                <p className="mt-1 text-sm text-zinc-400">
                    {description}
                </p>

            </div>

            <button onClick={onToggle} className={`
                relative
                h-7 w-14
                rounded-full
                transition-all duration-300
                ${
                    checked
                        ? "bg-cyan-500"
                        : "bg-zinc-700"
                }
            `}>
                <span className={`
                    absolute top-1
                    h-5 w-5
                    rounded-full
                    bg-white
                    transition-all
                    duration-300
                    ${
                        checked
                            ? "left-8"
                            : "left-1"
                    }
                    `}
                />
            </button>
        </div>
    );
}