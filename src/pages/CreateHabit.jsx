import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {
    Sparkles,
    Calendar,
    Tag,
    Flag,
    ArrowLeft,
    Zap,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { API } from "../utils/api";

export default function CreateHabit() {
    const navigate = useNavigate();
    const token = Cookies.get("token");

    const [form, setForm] = useState({
        name: "",
        frequency: "daily",
        category: "general",
        priority: "medium",
    });

    const [error, setError] = useState("");
    const [focusedInput, setFocusedInput] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${API}/api/habits`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to create habit");
                setError(data.message || "Failed to create habit");               
                return;
            }
            toast.success("Habit created successfully!");

            navigate("/");
        } catch (error) {
            setError("Something went wrong");
            toast.error("Something went wrong");
            console.log("Error creating habit:", error);
        }
    };

    // Category suggestions
    const categories = [
        { name: "Health", icon: "💪" },
        { name: "Fitness", icon: "🏃" },
        { name: "Learning", icon: "📚" },
        { name: "Creative", icon: "🎨" },
        { name: "Wellness", icon: "🧘" },
        { name: "Productivity", icon: "⚡" },
        { name: "Social", icon: "👥" },
        { name: "Finance", icon: "💰" },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden pt-16">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 -z-10"></div>
            <div className="fixed top-20 right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
            <div className="fixed bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>

            <Navbar />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Dashboard</span>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Create New Habit
                    </h1>
                    <p className="text-gray-600">Start building a better you today ✨</p>
                </div>

                {/* Form Card */}
                <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-3xl p-8 shadow-xl">
                    <div className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="backdrop-blur-xl bg-red-100/80 border border-red-300/50 rounded-2xl px-4 py-3">
                                <p className="text-red-700 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {/* Habit Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Zap className="w-4 h-4 text-indigo-600" />
                                Habit Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                onFocus={() => setFocusedInput("name")}
                                onBlur={() => setFocusedInput("")}
                                className={`w-full px-4 py-3.5 backdrop-blur-xl bg-white/40 border-2 rounded-2xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${focusedInput === "name"
                                    ? "border-indigo-400 bg-white/60 shadow-lg shadow-indigo-100/50"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                                placeholder="e.g., Morning Meditation, Read 30 Minutes"
                                required
                            />
                        </div>

                        {/* Frequency */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                <Calendar className="w-4 h-4 text-indigo-600" />
                                Frequency
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {["daily", "weekly", "monthly"].map((freq) => (
                                    <button
                                        key={freq}
                                        type="button"
                                        onClick={() => setForm({ ...form, frequency: freq })}
                                        className={`py-3 rounded-xl font-semibold transition-all duration-200 ${form.frequency === freq
                                            ? "backdrop-blur-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                                            : "backdrop-blur-xl bg-white/40 border border-gray-200 text-gray-700 hover:border-indigo-300"
                                            }`}
                                    >
                                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                <Tag className="w-4 h-4 text-indigo-600" />
                                Category
                            </label>

                            {/* Quick Select Categories */}
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.name}
                                        type="button"
                                        onClick={() => setForm({ ...form, category: cat.name.toLowerCase() })}
                                        className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${form.category === cat.name.toLowerCase()
                                            ? "backdrop-blur-xl bg-indigo-500/20 border-2 border-indigo-500 text-indigo-700"
                                            : "backdrop-blur-xl bg-white/40 border border-gray-200 text-gray-700 hover:border-indigo-300"
                                            }`}
                                    >
                                        <span className="block text-lg mb-1">{cat.icon}</span>
                                        <span className="text-xs">{cat.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Custom Category Input */}
                            <input
                                type="text"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                onFocus={() => setFocusedInput("category")}
                                onBlur={() => setFocusedInput("")}
                                className={`w-full px-4 py-3 backdrop-blur-xl bg-white/40 border-2 rounded-2xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${focusedInput === "category"
                                    ? "border-indigo-400 bg-white/60 shadow-lg shadow-indigo-100/50"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                                placeholder="Or type custom category"
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                <Flag className="w-4 h-4 text-indigo-600" />
                                Priority
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {["low", "medium", "high"].map((priority) => (
                                    <button
                                        key={priority}
                                        type="button"
                                        onClick={() => setForm({ ...form, priority })}
                                        className={`py-3 rounded-xl font-semibold transition-all duration-200 ${form.priority === priority
                                            ? priority === "high"
                                                ? "backdrop-blur-xl bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30"
                                                : priority === "medium"
                                                    ? "backdrop-blur-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30"
                                                    : "backdrop-blur-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                                            : "backdrop-blur-xl bg-white/40 border border-gray-200 text-gray-700 hover:border-indigo-300"
                                            }`}
                                    >
                                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full flex items-center justify-center gap-2 backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40"
                        >
                            <Sparkles className="w-5 h-5" />
                            Create Habit
                        </button>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="mt-6 backdrop-blur-xl bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">💡 Tips for Success</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Start small - consistency beats intensity</li>
                        <li>• Be specific with your habit name</li>
                        <li>• Choose a realistic frequency</li>
                        <li>• Track your progress daily</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}