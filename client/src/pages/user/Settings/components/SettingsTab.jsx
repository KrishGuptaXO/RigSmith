import { settingsTabs } from "../settingsData";

export default function SettingsTab({activeTab, setActiveTab}) {
    return (
        <div className="flex flex-wrap gap-3 rounded-2xl border border-zinc-800 bg-[#111827] p-3">
            {settingsTabs.map((tab)=>(
                <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)} 
                    className= {`
                        rounded-xl 
                        px-5 py-3 
                        text-sm font-medium 
                        transition-all duration-200
                        ${activeTab === tab.id
                            ? "bg-cyan-500 text-black shadow-lg"
                            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        }
                    `}
                >
                    {tab.label}

                </button>
            ))}
        </div>
    );
}