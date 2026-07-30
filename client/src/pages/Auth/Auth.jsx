import WelcomePanel from "./components/WelcomePanel"
import AuthForm from "./components/AuthForm"
import { useState } from "react";

export default function Auth () {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <section className="
            min-h-screen
            bg-[#0B0F17]
            flex items-center justify-center
            p-6
        ">
            <div className="
                w-full max-w-6xl
                overflow-hidden
                rounded-3xl
                border border-[#222938]
                bg-[#121722]
                shadow-2xl
                grid lg:grid-cols-2
            ">
                
                <WelcomePanel isLogin={isLogin} />
                <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} />

            </div>
        </section>
    );
}