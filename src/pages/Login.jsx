import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { API } from "../utils/api";



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
                return;
            }

            // Save token in cookie
            Cookies.set("token", data.token, {
                expires: 7,
                secure: false,
                sameSite: "strict",
            });

            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError("Something went wrong");
            console.error(err);
        }
    };
    useEffect(() => {
        document.title = "Login - Habit Track";
        const token = Cookies.get("token");
        if (token) {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white shadow-lg p-8 rounded-xl w-full max-w-sm"
            >
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
                    Login
                </h1>

                {error && (
                    <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
                )}

                <label className="block mb-3">
                    <span className="text-gray-600">Email</span>
                    <input
                        type="email"
                        name="email"
                        className="w-full p-2 border rounded mt-1"
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-gray-600">Password</span>
                    <input
                        type="password"
                        name="password"
                        className="w-full p-2 border rounded mt-1"
                        onChange={handleChange}
                        required
                    />
                </label>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>

                <p className="text-center text-sm mt-4">
                    Don’t have an account?{" "}
                    <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => navigate("/signup")}
                    >
                        Signup
                    </span>
                </p>
            </form>
        </div>
    );
}
