import { Mail, Lock, UserRound } from "lucide-react";
import Button from "../../../components/common/Button";

export default function AuthForm ({isLogin, setIsLogin}) {
    return (
        <div className="
            flex flex-col justify-center \
            bg-[#121722]
            px-8 py-14
            md:px-14"
        >

            {/* Heading */}
            <h2 className="text-4xl font-bold text-white">
                {isLogin ? "Sign In" : "Create Account"}
            </h2>

            <p className="mt-2 mb-10 text-zinc-400">
                {isLogin
                    ? "Welcome back! Please login to continue."
                    : "Create an account to start using RigSmith."
                }
            </p>

            {/* Name */}
            {!isLogin && (
                <div className="mb-5">
                    <label className="mb-2 block text-sm text-zinc-400">
                        Full Name
                    </label>

                    <div className="
                        flex items-center 
                        rounded-xl 
                        border border-[#2A3240]
                        bg-[#0F141D]
                        px-4"
                    >
                        <UserRound size={18} className="text-zinc-500" />
                        
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full bg-transparent px-3 py-4 text-white outline-none placeholder:text-zinc-600"
                        />
                        
                    </div>
                </div>
            )}

            {/* Email */}
            <div className="mb-5">
                <label className="mb-2 block text-sm text-zinc-400">
                    Email
                </label>

                <div className="
                    flex items-center
                    rounded-xl
                    border border-[#2A3240]
                    bg-[#0F141D]
                    px-4
                ">
                    <Mail size={18} className="text-zinc-500" />

                    <input
                        type="email"
                        placeholder="name@example.com"
                        className="w-full bg-transparent px-3 py-4 text-white outline-none placeholder:text-zinc-600"
                    />
                </div>
            </div>

            {/* Password */}
            <div className="mb-5">
                <label className="mb-2 block text-sm text-zinc-400">
                    Password
                </label>

                <div className="
                    flex items-center
                    rounded-xl
                    border
                    border-[#2A3240]
                    bg-[#0F141D]
                    px-4
                ">
                    <Lock size={18} className="text-zinc-500" />

                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-transparent px-3 py-4 text-white outline-none placeholder:text-zinc-600"
                    />
                </div>
            </div>

            {/* Forgot Password */}
            {isLogin && (
                <button className="mb-8 self-end text-sm text-cyan-400 hover:underline cursor-pointer">
                    Forgot Password?
                </button>
            )}

            {/* CTA */}
            <Button className="w-full py-4">
                {isLogin ? "Sign In" : "Create Account"}
            </Button>

            {/* Switch */}
            <p className="mt-8 text-center text-zinc-400">
                {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"
                }

                <button onClick={() => setIsLogin(!isLogin)} className="ml-2 font-medium text-cyan-400 hover:underline cursor-pointer">
                    {isLogin ? "Sign Up!" : "Sign In!"}
                </button>
            </p>
        </div>
    );
}