import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
    Target,
    CheckCircle,
    Flame,
    Trophy,
    Plus,
    TrendingUp,
    TrendingDown,
    BarChart3,
} from "lucide-react";

import Navbar from "../components/Navbar";
import HabitCard from "../components/HabitCard";
import { API } from "../utils/api";

export default function Dashboard() {
    const navigate = useNavigate();
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [strongest, setStrongest] = useState(null);
    const [weakest, setWeakest] = useState(null);
    const [overview, setOverview] = useState([]);
    const [avgStreak, setAvgStreak] = useState(0);
    const [totalCheckins, setTotalCheckins] = useState(0);
    const [myChallenges, setMyChallenges] = useState([]);

    const token = Cookies.get("token");

    // Fetch habits
    const getHabits = async () => {
        try {
            const res = await fetch(`${API}/api/habits`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setHabits(data.habits || []);
            setLoading(false);
        } catch (error) {
            console.log("Error loading habits:", error);
            setLoading(false);
        }
    };

    // Get strongest habit
    const getStrongest = async () => {
        try {
            const res = await fetch(`${API}/api/insights/strongest`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setStrongest(data.strongest || null);
        } catch (error) {
            console.error("Error fetching strongest:", error);
        }
    };

    // Get weakest habit
    const getWeakest = async () => {
        try {
            const res = await fetch(`${API}/api/insights/weakest`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setWeakest(data.weakest || null);
        } catch (error) {
            console.error("Error fetching weakest:", error);
        }
    };

    const getOverview = async () => {
        try {
            const res = await fetch(`${API}/api/insights/overview`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            setOverview(data.overview || []);

            // Calculate total check-ins
            const total = data.overview.reduce((sum, h) => sum + h.totalCompletions, 0);
            setTotalCheckins(total);

            // Avg streak = (check-ins / number of habits)
            const avg = data.overview.length > 0 ? total / data.overview.length : 0;
            setAvgStreak(avg.toFixed(1));
        } catch (error) {
            console.error("Error fetching overview:", error);
        }
    };

    const loadMyChallenges = async () => {
        try {
            const res = await fetch(`${API}/api/challenge/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setMyChallenges(data.challenges || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getHabits();
        getStrongest();
        getWeakest();
        getOverview();
        loadMyChallenges();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-8">
                    <p className="text-gray-600 text-lg">Loading your habits...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden pt-16">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 -z-10"></div>
            <div className="fixed top-20 right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
            <div className="fixed bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>

            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome! 👋
                    </h1>
                    <p className="text-gray-600">Here's your habit journey overview</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* Total Habits */}
                    <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center justify-between mb-2">
                            <Target className="w-8 h-8 text-indigo-600" />
                            <div className="backdrop-blur-xl bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                                <span className="text-xs font-semibold text-indigo-600">
                                    Active
                                </span>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                            {overview.length}
                        </p>
                        <p className="text-sm text-gray-600">Total Habits</p>
                    </div>

                    {/* Total Check-ins */}
                    <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center justify-between mb-2">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <div className="backdrop-blur-xl bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                                <span className="text-xs font-semibold text-green-600">
                                    Total
                                </span>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                            {totalCheckins}
                        </p>
                        <p className="text-sm text-gray-600">Total Check-ins</p>
                    </div>

                    {/* Average Streak */}
                    <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center justify-between mb-2">
                            <Flame className="w-8 h-8 text-orange-600" />
                            <div className="backdrop-blur-xl bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                                <span className="text-xs font-semibold text-orange-600">
                                    Average
                                </span>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{avgStreak}</p>
                        <p className="text-sm text-gray-600">Avg Streak (days)</p>
                    </div>
                </div>

                {/* Challenges Section */}
                {myChallenges.length > 0 && (
                    <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-6 shadow-lg mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-indigo-600" />
                                <h2 className="text-xl font-bold text-gray-900">
                                    Your Challenges
                                </h2>
                            </div>
                            <button
                                onClick={() => navigate("/challenges")}
                                className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                            >
                                View All
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {myChallenges.map((c) => (
                                <button
                                    key={c._id}
                                    onClick={() => navigate(`/challenge/${c._id}`)}
                                    className="cursor-pointer backdrop-blur-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-4 py-2 rounded-xl text-indigo-700 font-medium transition-all duration-200 hover:scale-[1.02]"
                                >
                                    🏆 {c.title}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Strongest Habit */}
                    <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="backdrop-blur-xl bg-green-500/20 border border-green-500/30 p-2 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Strongest Habit
                            </h3>
                        </div>
                        {strongest ? (
                            <div>
                                <p className="text-2xl font-bold text-gray-900 mb-1">
                                    💪 {strongest.name}
                                </p>
                                <p className="text-sm text-gray-600">Keep crushing it!</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">No data yet.</p>
                        )}
                    </div>

                    {/* Weakest Habit */}
                    <div className="backdrop-blur-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="backdrop-blur-xl bg-orange-500/20 border border-orange-500/30 p-2 rounded-xl">
                                <TrendingDown className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Needs Attention
                            </h3>
                        </div>
                        {weakest ? (
                            <div>
                                <p className="text-2xl font-bold text-gray-900 mb-1">
                                    🎯 {weakest.name}
                                </p>
                                <p className="text-sm text-gray-600">Let's get this one going!</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">No data yet.</p>
                        )}
                    </div>
                </div>

                {/* Habits Section */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Your Habits</h2>
                    <button
                        onClick={() => navigate("/create-habit")}
                        className="cursor-pointer flex items-center gap-2 backdrop-blur-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-indigo-500/30"
                    >
                        <Plus className="w-4 h-4" />
                        Add Habit
                    </button>
                </div>

                {habits.length === 0 ? (
                    <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-12 text-center">
                        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg mb-4">
                            No habits yet. Let's create your first one!
                        </p>
                        <button
                            onClick={() => navigate("/create-habit")}
                            className="backdrop-blur-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                        >
                            Create First Habit
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {habits.map((habit) => (
                            <HabitCard key={habit._id} habit={habit} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}