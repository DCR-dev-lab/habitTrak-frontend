import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
    ArrowLeft,
    Flame,
    Calendar,
    TrendingUp,
    Target,
    Award,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { API } from "../utils/api";
import Navbar from "../components/Navbar";

export default function HabitDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = Cookies.get("token");

    const [habit, setHabit] = useState(null);
    const [history, setHistory] = useState([]);
    const [streak, setStreak] = useState(0);
    const [weekly, setWeekly] = useState([]);
    const [monthly, setMonthly] = useState([]);
    const [successRate, setSuccessRate] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch habit info
    const getHabit = async () => {
        try {
            const res = await fetch(`${API}/api/habits`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            const found = data.habits.find((h) => h._id === id);
            setHabit(found);
        } catch (error) {
            console.error("Error fetching habit:", error);
        }
    };

    // History
    const getHistory = async () => {
        try {
            const res = await fetch(`${API}/api/checkin/history/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setHistory(data.history || []);
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    // Streak
    const getStreak = async () => {
        try {
            const res = await fetch(`${API}/api/checkin/streak/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setStreak(data.streak || 0);
        } catch (error) {
            console.error("Error fetching streak:", error);
        }
    };

    // Insights: weekly
    const getWeekly = async () => {
        try {
            const res = await fetch(`${API}/api/insights/weekly/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setWeekly(data.weekly || []);
        } catch (error) {
            console.error("Error fetching weekly:", error);
        }
    };

    // Insights: monthly
    const getMonthly = async () => {
        try {
            const res = await fetch(`${API}/api/insights/monthly/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setMonthly(data.monthly || []);
        } catch (error) {
            console.error("Error fetching monthly:", error);
        }
    };

    // Insights: success rate
    const getSuccessRate = async () => {
        try {
            const res = await fetch(`${API}/api/insights/success-rate/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setSuccessRate(data.successRate || 0);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching success rate:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getHabit();
        getHistory();
        getStreak();
        getWeekly();
        getMonthly();
        getSuccessRate();
    }, [id]);

    if (loading || !habit) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-8">
                    <p className="text-gray-600 text-lg">Loading habit details...</p>
                </div>
            </div>
        );
    }

    // Get day names for weekly view
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="min-h-screen relative overflow-hidden pt-16">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 -z-10"></div>
            <div className="fixed top-20 right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
            <div className="fixed bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>

            <Navbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Dashboard</span>
                </button>

                {/* Habit Header Card */}
                <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-3xl p-8 shadow-lg mb-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        {/* Left: Habit Info */}
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {habit.name}
                            </h1>

                            <div className="flex flex-wrap gap-3 mb-4">
                                {/* Frequency Badge */}
                                <div className="flex items-center gap-2 backdrop-blur-xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl">
                                    <Calendar className="w-4 h-4 text-indigo-600" />
                                    <span className="text-sm font-semibold text-indigo-600 uppercase">
                                        {habit.frequency}
                                    </span>
                                </div>

                                {/* Category Badge */}
                                <div className="flex items-center gap-2 backdrop-blur-xl bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-xl">
                                    <Target className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-semibold text-purple-600">
                                        {habit.category || "General"}
                                    </span>
                                </div>

                                {/* Priority Badge */}
                                <div className="flex items-center gap-2 backdrop-blur-xl bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl">
                                    <Award className="w-4 h-4 text-orange-600" />
                                    <span className="text-sm font-semibold text-orange-600 uppercase">
                                        {habit.priority || "Medium"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Streak Display */}
                        <div className="backdrop-blur-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6 min-w-[200px]">
                            <div className="flex items-center gap-3 mb-2">
                                <Flame className="w-10 h-10 text-orange-500" fill="currentColor" />
                                <div>
                                    <p className="text-4xl font-bold text-gray-900">{streak}</p>
                                    <p className="text-sm text-gray-600">day streak</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {streak > 0 ? "🔥 You're on fire!" : "Start your streak today!"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Success Rate */}
                    <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="backdrop-blur-xl bg-green-500/20 border border-green-500/30 p-2 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-700">Success Rate</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-2">
                            {successRate}%
                        </p>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${successRate}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Total Completions */}
                    <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="backdrop-blur-xl bg-blue-500/20 border border-blue-500/30 p-2 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-700">Completions</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                            {history.filter((h) => h.completed).length}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Total check-ins</p>
                    </div>

                    {/* Best Streak */}
                    <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="backdrop-blur-xl bg-orange-500/20 border border-orange-500/30 p-2 rounded-xl">
                                <Award className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="font-semibold text-gray-700">Current Streak</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{streak}</p>
                        <p className="text-sm text-gray-500 mt-1">days in a row</p>
                    </div>
                </div>

                {/* Weekly Progress */}
                <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-6 shadow-lg mb-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Weekly Progress</h2>
                    </div>

                    <div className="grid grid-cols-7 gap-3">
                        {weekly.map((day, index) => {
                            const date = new Date(day.date);
                            const dayName = dayNames[date.getDay()];
                            const dayNum = date.getDate();

                            return (
                                <div key={index} className="flex flex-col items-center">
                                    <span className="text-xs text-gray-500 mb-2 font-medium">
                                        {dayName}
                                    </span>
                                    <div
                                        className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 ${day.completed
                                            ? "backdrop-blur-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                                            : "backdrop-blur-xl bg-gray-200/60 border border-gray-300/50 text-gray-400"
                                            }`}
                                    >
                                        {day.completed ? (
                                            <CheckCircle className="w-6 h-6 mb-1" />
                                        ) : (
                                            <XCircle className="w-6 h-6 mb-1" />
                                        )}
                                        <span className="text-sm font-bold">{dayNum}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Monthly Progress */}
                <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Monthly Progress</h2>
                    </div>

                    <div className="grid grid-cols-10 gap-2">
                        {monthly.map((day, index) => {
                            const date = new Date(day.date);
                            const dayNum = date.getDate();

                            return (
                                <div
                                    key={index}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-300 hover:scale-105 ${day.completed
                                        ? "backdrop-blur-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/20"
                                        : "backdrop-blur-xl bg-gray-200/60 border border-gray-300/50 text-gray-400"
                                        }`}
                                >
                                    {dayNum}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-indigo-500"></div>
                            <span className="text-sm text-gray-600">Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gray-200 border border-gray-300"></div>
                            <span className="text-sm text-gray-600">Missed</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}