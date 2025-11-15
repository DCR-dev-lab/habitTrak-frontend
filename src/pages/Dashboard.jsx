import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

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
        }
    };

    // Get strongest habit
    const getStrongest = async () => {
        const res = await fetch(`${API}/api/insights/strongest`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStrongest(data.strongest || null);
    };
    // Get weakest habit
    const getWeakest = async () => {
        const res = await fetch(`${API}/api/insights/weakest`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setWeakest(data.weakest || null);
    };

    const getOverview = async () => {
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


    if (loading) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className=" mx-auto p-6">

                {/* Summary Stats */}
                <div className="p-5 bg-white shadow-md rounded-xl border border-gray-200 mb-6 flex justify-between items-center">

                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Total Habits</h3>
                        <p className="text-2xl font-bold text-blue-600">{overview.length}</p>
                    </div>

                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Total Check-ins</h3>
                        <p className="text-2xl font-bold text-green-600">{totalCheckins}</p>
                    </div>

                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Avg Streak</h3>
                        <p className="text-2xl font-bold text-purple-600">{avgStreak}</p>
                    </div>

                </div>

                {/* My Challenges */}
                <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                    <h3 className="text-lg font-semibold mb-2">Your Challenges</h3>
                    {myChallenges.length === 0 ? (
                        <p className="text-gray-500">You are not in any challenge.</p>
                    ) : (
                        <div className="flex gap-3">
                            {myChallenges.map((c) => (
                                <button
                                    key={c._id}
                                    onClick={() => navigate(`/challenge/${c._id}`)}
                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded"
                                >
                                    {c.title}
                                </button>
                            ))}
                        </div>
                    )}
                </div>



                {/* Insights Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                    {/* Strongest Habit */}
                    <div className="p-5 bg-green-50 border border-green-200 rounded-xl shadow-sm transition-all duration-200 hover:shadow-lg">
                        <h2 className="text-xl font-semibold text-green-700 mb-2">Strongest Habit</h2>
                        {strongest ? (
                            <p className="text-gray-700 text-lg">
                                💪 {strongest.name}
                            </p>
                        ) : (
                            <p className="text-gray-500">No data yet.</p>
                        )}
                    </div>

                    {/* Weakest Habit */}
                    <div className="p-5 bg-red-50 border border-red-200 rounded-xl shadow-sm transition-all duration-200 hover:shadow-lg">
                        <h2 className="text-xl font-semibold text-red-700 mb-2">Weakest Habit</h2>
                        {weakest ? (
                            <p className="text-gray-700 text-lg">
                                ☁️ {weakest.name}
                            </p>
                        ) : (
                            <p className="text-gray-500">No data yet.</p>
                        )}
                    </div>

                </div>

                {habits.length === 0 ? (
                    <p className="text-gray-600 text-center mt-10">
                        No habits yet. Create one!
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {habits.map((habit) => (
                            <HabitCard key={habit._id} habit={habit} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
