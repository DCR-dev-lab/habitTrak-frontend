import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Flame, Calendar, CheckCircle } from "lucide-react";
import { API } from "../utils/api";

export default function HabitCard({ habit }) {
    const navigate = useNavigate();
    const [streak, setStreak] = useState(0);
    const [totalCompletions, setTotalCompletions] = useState(0);
    const token = Cookies.get("token");

    // Get streak for each habit
    const getStreak = async () => {
        try {
            const res = await fetch(`${API}/api/checkin/streak/${habit._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setStreak(data.streak || 0);
        } catch (error) {
            console.error("Error fetching streak:", error);
        }
    };

    // Mark today's check-in
    const markToday = async (e) => {
        e.stopPropagation(); // Prevent card click
        try {
            await fetch(`${API}/api/checkin/mark`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ habitId: habit._id }),
            });
            getStreak();
        } catch (error) {
            console.error("Error marking habit:", error);
        }
    };

    // Unmark today's check-in
    const unmarkToday = async (e) => {
        e.stopPropagation(); // Prevent card click
        try {
            await fetch(`${API}/api/checkin/uncheck`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ habitId: habit._id }),
            });
            getStreak();
        } catch (error) {
            console.error("Error unmarking habit:", error);
        }
    };

    const handleCardClick = () => {
        navigate(`/habit/${habit._id}`);
    };

    useEffect(() => {
        getStreak();
    }, []);

    return (
        <div
            onClick={handleCardClick}
            className="group relative overflow-hidden backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                            {habit.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500 uppercase tracking-wide">
                                {habit.frequency}
                            </span>
                        </div>
                    </div>

                    {/* Category badge */}
                    <div className="backdrop-blur-xl bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold text-indigo-600">
                            {habit.category.toUpperCase() || "General"}
                        </span>
                    </div>
                </div>

                {/* Streak Display */}
                <div className="backdrop-blur-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Flame className="w-8 h-8 text-orange-500" fill="currentColor" />
                                {streak > 0 && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">{streak}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{streak}</p>
                                <p className="text-xs text-gray-600">day streak</p>
                            </div>
                        </div>

                        {streak > 0 && (
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Keep it up!</p>
                                <p className="text-xs text-gray-500">
                                    🎯 {totalCompletions || 7} total
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={markToday}
                        className="flex-1 flex items-center justify-center gap-2 backdrop-blur-xl bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-green-500/20"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Complete
                    </button>

                    <button
                        onClick={unmarkToday}
                        className="backdrop-blur-xl bg-gray-200/60 hover:bg-gray-300/60 text-gray-700 font-semibold px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                    >
                        Undo
                    </button>
                </div>
            </div>
        </div>
    );
}