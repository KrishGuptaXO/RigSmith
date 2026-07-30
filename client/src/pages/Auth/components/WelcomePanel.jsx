import Logo from "../../../assets/logos/SignInLogo.png"

export default function WelcomePanel({isLogin}) {
    return (
        <div className="
            relative hidden
            lg:flex flex-col justify-center items-center
            overflow-hidden
            bg-gradient-to-br
            from-[#0F172A]
            via-[#132238]
            to-[#102B45]
            p-12
        ">
            {/* Background Glow */}
            <div className="
                absolute
                -left-24
                top-20
                h-72 w-72
                rounded-full
                bg-cyan-500/10
                blur-3xl"
            />

            <div className="
                absolute
                -right-24
                bottom-16
                h-80 w-80
                rounded-full
                bg-blue-600/10
                blur-3xl"
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
                
                <img
                    src={Logo}
                    alt="RigSmith"
                    className="mb-3 h-75 w-75 object-contain select-none"
                    draggable={false}
                />

                <h1 className="mb-4 text-4xl font-bold text-zinc-200">
                    {isLogin ? "Welcome back!" : "Join RigSmith!"}
                </h1>

                <p className="text-lg text-zinc-300">
                    {isLogin
                        ? "Sign in to continue building, tracking orders, and managing your PCs."
                        : "Create your account and start building your dream setup with Us!"
                    }
                </p>
            </div>
        </div>
    );
}