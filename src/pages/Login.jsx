import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

import { API } from "../utils/api";
import { LogIn, Mail, Lock } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Login failed");
                toast.error(data.message || "Login failed");
                return;
            }

            Cookies.set("token", data.token, {
                expires: 7,
                secure: false,
                sameSite: "strict",
            });
            toast.success("Logged in successfully!");

            navigate("/", { replace: true });
        } catch (err) {
            setError("Something went wrong");
            toast.error("Something went wrong");
            console.error(err);
        }
    };

    useEffect(() => {
        document.title = "Login - Habit Track";
        const token = Cookies.get("token");
        if (token) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-100 relative overflow-hidden px-4">

            {/* Glowing Blobs */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

            {/* Card */}
            <form
                onSubmit={handleLogin}
                className="backdrop-blur-xl bg-white/40 border border-white/30 shadow-2xl p-10 rounded-3xl w-full max-w-md"
            >
                <div className="flex justify-center items-center gap-2 mb-6">
                    <LogIn className="w-8 h-8 text-indigo-600" />
                    <h1 className="text-3xl font-bold text-gray-800">Login</h1>
                </div>

                {error && (
                    <p className="text-red-500 text-center mb-4 text-sm font-medium">
                        {error}
                    </p>
                )}

                {/* Email */}
                <label className="block mb-5">
                    <div className="flex items-center gap-3 bg-white/60 border border-gray-200 rounded-xl p-3 backdrop-blur">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full bg-transparent outline-none"
                            onChange={handleChange}
                            required
                        />
                    </div>
                </label>

                {/* Password */}
                <label className="block mb-6">
                    <div className="flex items-center gap-3 bg-white/60 border border-gray-200 rounded-xl p-3 backdrop-blur">
                        <Lock className="w-5 h-5 text-gray-500" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full bg-transparent outline-none"
                            onChange={handleChange}
                            required
                        />
                    </div>
                </label>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:scale-[1.02]"
                >
                    Login
                </button>

                <p className="text-center text-sm mt-4 text-gray-700">
                    Don’t have an account?{" "}
                    <span
                        className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-800"
                        onClick={() => navigate("/signup")}
                    >
                        Signup
                    </span>
                </p>
            </form>
        </div>
    );
}
