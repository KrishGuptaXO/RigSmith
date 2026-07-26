import AnimatedSubtitle from "../layout/Header/AnimatedSubtitle";

export default function Greetings ({user}) {
    const hour = new Date().getHours();
    const isNightOwl = hour >= 0 && hour <= 5;
    let greeting = "";

    if(hour >= 5 && hour < 12) {
        greeting = "Good Morning";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon";
    } else if (hour >= 17 && hour < 21) {
        greeting = "Good Evening";
    } else {
        greeting = "Let's build tonight";
    }
    return (
        <div>
            <h1 className="text-4xl text-bold text-white">
                {greeting}, {user} 👋🏼
            </h1>

            <AnimatedSubtitle easterEgg={isNightOwl} />
        </div>
    )
}