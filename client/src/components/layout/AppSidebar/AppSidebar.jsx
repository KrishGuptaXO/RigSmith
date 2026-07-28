import {navigation} from './navigation.js';
import { NavLink } from 'react-router-dom';
import { PanelRight } from 'lucide-react';
import Logo from "../../../assets/logos/PageLogo.png"

export default function AppSidebar ({collapsed, toggleSidebar}) {
    return (
        <aside 
            className={`
            ${collapsed ? "w-20" : "w-64"}
            fixed
            left-0
            top-0
            h-screen
            bg-[#0D1117]
            transition-all
            duration-300
            z-50 
            shadow-[4px_0_12px_rgba(0,0,0,0.25)] 
            `}
        >
            <div className={`flex items-center px-5 py-5 ${collapsed ? "justify-center" : "justify-between"}`}>
                {collapsed ? (
                    <img
                        src={Logo}
                        alt='RigSmith'
                        className="h-10 w-10 object-contain select-none transition-all duration-300"
                        draggable={false}
                    />
                ) : (
                    <h1 className="text-2xl font-bold text-white">
                        RigSmith
                    </h1>
                )}

                <button 
                onClick={toggleSidebar}
                className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-[#191528] hover:text-cyan-400 cursor-pointer"
                >
                    <PanelRight
                        size={20}
                        className={`transition-transform duration-300 ${
                            collapsed ? "rotate-180" : ""}
                        `} 
                    />
                </button>
            </div>
            <nav className='mt-6 flex flex-col gap-2 px-3'>
                {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => 
                                `flex items-center gap-3
                                rounded-xl
                                px-4
                                py-3
                                transition-all
                                duration-300
                                ${
                                    isActive 
                                    ? "bg-[#191528] text-cyan-400 justify-center px-0" 
                                    : "text-zinc-400 hover:bg-[#191528] hover:text-cyan-400"
                                }`
                            }
                        >
                            <Icon size={20} />
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}