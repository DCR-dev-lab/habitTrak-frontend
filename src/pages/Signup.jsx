import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { API } from "../utils/api";

export default function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`${API}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Signup failed");
                return;
            }

            // Save token in cookie
            Cookies.set("token", data.token, {
                expires: 7,
                secure: false,
                sameSite: "strict",
            });

            setSuccess("Account created successfully!");

            setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 800);
        } catch (err) {
            setError("Something went wrong");
            console.error(err);
        }
    };

    useEffect(() => {
        document.title = "Signup - Habit Track";
        // Redirect if already logged in
        const token = Cookies.get("token");
        if (token) {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSignup}
                className="bg-white shadow-lg p-8 rounded-xl w-full max-w-sm"
            >
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
                    Signup
                </h1>

                {error && (
                    <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
                )}

                {success && (
                    <p className="text-green-500 text-sm mb-3 text-center">{success}</p>
                )}

                <label className="block mb-3">
                    <span className="text-gray-600">Username</span>
                    <input
                        type="text"
                        name="username"
                        className="w-full p-2 border rounded mt-1"
                        onChange={handleChange}
                        required
                    />
                </label>

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
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Signup
                </button>

                <p className="text-center text-sm mt-4">
                    Already have an account?{" "}
                    <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
}
