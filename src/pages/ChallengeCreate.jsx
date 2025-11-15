import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Trophy,
    ArrowLeft,
    Sparkles,
    Calendar,
    Zap,
    Users,
    FileText,
    Target,
    CheckCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { API } from "../utils/api";

export default function ChallengeCreate() {
    const navigate = useNavigate();
    const token = Cookies.get("token");

    const [form, setForm] = useState({
        title: "",
        description: "",
    });

    const [status, setStatus] = useState({ type: "", message: "" });
    const [isCreating, setIsCreating] = useState(false);
    const [focusedInput, setFocusedInput] = useState("");

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
        setStatus({ type: "", message: "" });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setStatus({ type: "", message: "" });
        setIsCreating(true);

        try {
            const payload = {
                title: form.title,
                description: form.description
            };

            const res = await fetch(`${API}/api/challenge/create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus({
                    type: "error",
                    message: data.message || "Failed to create challenge",
                });
                toast.error(data.message || "Failed to create challenge");
                setIsCreating(false);
                return;
            }

            toast.success("Challenge created successfully!");
            setStatus({
                type: "success",
                message: "Challenge created successfully! Redirecting...",
            });

            setTimeout(() => {
                navigate("/challenges");
            }, 1500);
        } catch (err) {
            setStatus({ type: "error", message: "Something went wrong" });
            toast.error("Something went wrong");
            setIsCreating(false);
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden pt-16">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 -z-10"></div>
            <div className="fixed top-20 right-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
            <div className="fixed bottom-20 left-20 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>

            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/challenges")}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Challenges</span>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4 shadow-lg">
                        <Trophy className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Create Challenge
                    </h1>
                    <p className="text-gray-600">
                        Design a challenge and invite others to join
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-3xl p-8 shadow-xl">
                            {/* Status Message */}
                            {status.message && (
                                <div
                                    className={`backdrop-blur-xl border-2 rounded-2xl px-4 py-3 mb-6 flex items-center gap-2 ${status.type === "success"
                                        ? "bg-green-100/80 border-green-300/50"
                                        : "bg-red-100/80 border-red-300/50"
                                        }`}
                                >
                                    {status.type === "success" ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <Trophy className="w-5 h-5 text-red-600" />
                                    )}
                                    <p
                                        className={`text-sm font-medium ${status.type === "success"
                                            ? "text-green-700"
                                            : "text-red-700"
                                            }`}
                                    >
                                        {status.message}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Sparkles className="w-4 h-4 text-yellow-600" />
                                        Challenge Title
                                    </label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                        onFocus={() => setFocusedInput("title")}
                                        onBlur={() => setFocusedInput("")}
                                        className={`w-full px-4 py-3.5 backdrop-blur-xl bg-white/40 border-2 rounded-2xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${focusedInput === "title"
                                            ? "border-yellow-400 bg-white/60 shadow-lg shadow-yellow-100/50"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        placeholder="e.g., 30-Day Fitness Challenge"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <FileText className="w-4 h-4 text-yellow-600" />
                                        Description
                                    </label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        onFocus={() => setFocusedInput("description")}
                                        onBlur={() => setFocusedInput("")}
                                        rows="4"
                                        className={`w-full px-4 py-3.5 backdrop-blur-xl bg-white/40 border-2 rounded-2xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 resize-none ${focusedInput === "description"
                                            ? "border-yellow-400 bg-white/60 shadow-lg shadow-yellow-100/50"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        placeholder="Describe your challenge, rules, and goals..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleCreate}
                                    disabled={isCreating || !form.title}
                                    className="w-full flex items-center justify-center gap-2 backdrop-blur-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] shadow-xl shadow-yellow-500/30 hover:shadow-2xl hover:shadow-yellow-500/40 disabled:cursor-not-allowed"
                                >
                                    {isCreating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Trophy className="w-5 h-5" />
                                            Create Challenge
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6">
                                {/* Tips */}
                                <div className="text-xs text-gray-600 space-y-1">
                                    <p className="font-semibold text-gray-700 mb-2">💡 Tips:</p>
                                    <p>• Be specific about challenge goals</p>
                                    <p>• Add clear rules and guidelines</p>
                                    <p>• Encourage participation!</p>
                                    <p>• Keep it fun and engaging</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}