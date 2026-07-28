import { useEffect, useState } from "react";
import Logo from "../../assets/logos/Logo.png"

export default function SplashScreen ({onFinish}) {
    const [hide, setHide] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(()=>{
            setHide(true);
        }, 2200);
        
        const finishTimer = setTimeout(()=>{
            onFinish?.();
        }, 2800);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(finishTimer);
        };
    }, [onFinish]);

    return (
        <div 
            className={`
            fixed inset-0 z-[9999]
            flex items-center justify-center
            bg-[#0B0F17]
            transition-opacity duration-700
            ${hide ? "opacity-0" : "opacity-100"}
            `}
        >
            <div className="logo-glow">

                {/* Logo */}
                <img 
                    src={Logo}
                    alt="RigSmith"
                    className="w-175 h-100 select-none"
                    draggable={false}
                />
                
            </div>
        </div>
    );
}