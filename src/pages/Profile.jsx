import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import { API } from "../utils/api";


export default function Profile() {
    const navigate = useNavigate();
    const token = Cookies.get("token");

    const [reminderTime, setReminderTime] = useState("");
    const [status, setStatus] = useState("");

    // Get current reminder time
    const loadReminder = async () => {
        const res = await fetch(`${API}/api/reminder`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        setReminderTime(data.reminderTime);
    };

    // Update reminder time
    const saveReminder = async () => {
        setStatus("");

        const res = await fetch(`${API}/api/reminder/set`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ reminderTime: reminderTime }),
        });

        const data = await res.json();

        if (!res.ok) {
            setStatus("❌ " + (data.message || "Failed to update"));
            return;
        }

        setStatus("✅ Reminder time updated!");
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
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="mt-8">
                <div className="bg-white p-8 shadow-lg rounded-xl max-w-md mx-auto">
                    <h1 className="text-3xl font-bold text-gray-700 mb-6">Profile</h1>

                    {/* Reminder Setting */}
                    <div className="mb-6">
                        <label className="block mb-2 text-gray-600">Daily Reminder Time</label>
                        <input
                            type="time"
                            className="border rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-blue-400"

                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                        />

                        <button
                            onClick={saveReminder}
                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Save
                        </button>

                        {status && <p className="mt-2 text-sm">{status}</p>}
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="w-full mt-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
