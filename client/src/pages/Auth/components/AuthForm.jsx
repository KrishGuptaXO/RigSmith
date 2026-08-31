import { Mail, Lock, UserRound } from "lucide-react";
import Button from "../../../components/common/Button";
import AuthInput from "../../../components/common/AuthInput";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AuthForm ({isLogin, setIsLogin}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        const endpoint = isLogin ? "http://localhost:5000/api/auth/login" : "http://localhost:5000/api/auth/register";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-type" : "application/json",
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            console.log("Auth response: ", data);

            toast.success(isLogin ? "Login successful" : "Account created successfully!");
        }  catch (error) {
            console.error("Authentication failed: ", error);
            setError(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="
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
                <AuthInput
                    label="Full Name"
                    placeholder="John Doe"
                    icon={UserRound}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            )}

            {/* Email */}
            <AuthInput
                label="Email"
                type="email"
                placeholder="name@example.com"
                icon={Mail}
                name="email"
                value={formData.email}
                onChange={handleChange}
            />

            {/* Password */}
            <AuthInput
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                name="password"
                value={formData.password}
                onChange={handleChange}
            />

            {/* Forgot Password */}
            {isLogin && (
                <button className="mb-8 self-end text-sm text-cyan-400 hover:underline cursor-pointer">
                    Forgot Password?
                </button>
            )}

            {error && (
                <p className="mb-4 text-sm text-red-400">
                    {error}
                </p>
            )}

            {/* CTA */}
            <Button type="submit" className="w-full py-4" disabled={loading}>
                {loading
                    ? isLogin
                        ? "Signing In..."
                        : "Creating Account..."
                    : isLogin
                        ? "Sign In"
                        : "Create Account"}
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
        </form>
    );
}