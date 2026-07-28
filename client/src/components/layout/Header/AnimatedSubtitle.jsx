import { useEffect, useState } from "react";

const messages = [
    "Welcome to RigSmith!",
    "Build Smarter 🧠",
    "Forge Faster ⚒️",
    "Game Harder 🎮",
];

export default function AnimatedSubtitle ({easterEgg}) {
    const [Messageindex, setMessageIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    
    useEffect(() => {
        if (easterEgg) {
            return;
        }
        let  charIndex = 0;
        const typing = setInterval(()=>{
            setDisplayText(
                messages[Messageindex].slice(0,charIndex+1)
            );
            charIndex++;

            if(charIndex === messages[Messageindex].length) {
                clearInterval(typing);
                setTimeout(()=>{
                    setDisplayText("");
                    setMessageIndex((prev) => (prev+1) % messages.length);
                }, 1800);
            }
        }, 70);
        
        return () => clearInterval(typing);

    }, [Messageindex, easterEgg]);

    if (easterEgg) {
        return (
            <p className="mt-1 text-zinc-400">
                You still gonna do it, <span className="italic">*hmph*</span> :|
            </p>
        );
    }

    return (
        <p className="mt-1 text-zinc-400">
            {displayText}
            <span className="animate-pulse">|</span>
        </p>
    );
}