import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    User,
    Bell,
    Clock,
    LogOut,
    Save,
    CheckCircle,
    Settings,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { API } from "../utils/api";

export default function Profile() {
    const navigate = useNavigate();
    const token = Cookies.get("token");

    const [reminderTime, setReminderTime] = useState("");
    const [status, setStatus] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Get current reminder time
    const loadReminder = async () => {
        try {
            const res = await fetch(`${API}/api/reminder`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setReminderTime(data.reminderTime || "");
        } catch (error) {
            console.error("Error loading reminder:", error);
        }
    };

    // Update reminder time
    const saveReminder = async () => {
        setStatus("");
        setIsSaving(true);

        try {
            const res = await fetch(`${API}/api/reminder/set`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reminderTime: reminderTime }),
            });

            if (!res.ok) {
                setStatus("error");
                toast.error("Failed to update reminder. Please try again.");
                setIsSaving(false);
                return;
            }
            toast.success("Reminder time updated successfully!");
            setStatus("success");
            setIsSaving(false);

            // Clear success message after 3 seconds
            setTimeout(() => setStatus(""), 3000);
        } catch (error) {
            console.error("Error saving reminder:", error);
            toast.error("Failed to update reminder. Please try again.");
            setStatus("error");
            setIsSaving(false);
        }
    };

    // Logout
    const logout = () => {
        Cookies.remove("token");
        navigate("/login");
    };

    useEffect(() => {
        loadReminder();
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden pt-16">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 -z-10"></div>
            <div className="fixed top-20 right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
            <div className="fixed bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>

            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-xl">
                        <User className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
                    <p className="text-gray-600">Manage your account settings</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Reminder Settings Card */}
                    <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="backdrop-blur-xl bg-indigo-500/20 border border-indigo-500/30 p-3 rounded-xl">
                                <Bell className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Daily Reminders
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Set a time to be reminded about your habits
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Time Picker */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <Clock className="w-4 h-4 text-indigo-600" />
                                    Reminder Time
                                </label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        className="w-full px-4 py-4 backdrop-blur-xl bg-white/40 border-2 border-gray-200 hover:border-indigo-300 rounded-2xl text-gray-900 outline-none transition-all duration-300 focus:border-indigo-400 focus:bg-white/60 focus:shadow-lg focus:shadow-indigo-100/50"
                                        value={reminderTime}
                                        onChange={(e) => setReminderTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={saveReminder}
                                disabled={isSaving}
                                className="cursor-pointer w-full flex items-center justify-center gap-2 backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Save Reminder Time
                                    </>
                                )}
                            </button>

                            {/* Status Messages */}
                            {status === "success" && (
                                <div className="backdrop-blur-xl bg-green-100/80 border border-green-300/50 rounded-2xl px-4 py-3 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <p className="text-green-700 text-sm font-medium">
                                        Reminder time updated successfully!
                                    </p>
                                </div>
                            )}

                            {status === "error" && (
                                <div className="backdrop-blur-xl bg-red-100/80 border border-red-300/50 rounded-2xl px-4 py-3">
                                    <p className="text-red-700 text-sm font-medium text-center">
                                        Failed to update reminder. Please try again.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Account Settings Card */}
                    <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="backdrop-blur-xl bg-purple-500/20 border border-purple-500/30 p-3 rounded-xl">
                                <Settings className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Account Settings
                                </h2>
                                <p className="text-sm text-gray-600">Manage your account</p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={logout}
                            className="cursor-pointer w-full flex items-center justify-center gap-2 backdrop-blur-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>

                    {/* Info Card */}
                    <div className="backdrop-blur-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <span>💡</span> Reminder Tips
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Choose a time when you're usually free</li>
                            <li>• Morning reminders work best for daily habits</li>
                            <li>• Enable notifications in your browser settings</li>
                            <li>• You can change this anytime</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}