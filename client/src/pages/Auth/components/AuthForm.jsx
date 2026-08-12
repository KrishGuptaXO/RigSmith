import { Mail, Lock, UserRound } from "lucide-react";
import Button from "../../../components/common/Button";
import AuthInput from "../../../components/common/AuthInput";

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

            {/* Name — only shown on Sign Up */}
            {!isLogin && (
                <AuthInput
                    label="Full Name"
                    placeholder="John Doe"
                    icon={UserRound}
                />
            )}

            {/* Email */}
            <AuthInput
                label="Email"
                type="email"
                placeholder="name@example.com"
                icon={Mail}
            />

            {/* Password */}
            <AuthInput
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
            />

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