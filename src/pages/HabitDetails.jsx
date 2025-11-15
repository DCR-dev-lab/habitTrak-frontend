import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
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

    // Fetch habit info
    const getHabit = async () => {
        const res = await fetch(`${API}/api/habits`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const found = data.habits.find((h) => h._id === id);
        setHabit(found);
    };

    // History
    const getHistory = async () => {
        const res = await fetch(
            `${API}/api/checkin/history/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setHistory(data.history || []);
    };

    // Streak
    const getStreak = async () => {
        const res = await fetch(
            `${API}/api/checkin/streak/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setStreak(data.streak || 0);
    };

    // Insights: weekly
    const getWeekly = async () => {
        const res = await fetch(
            `${API}/api/insights/weekly/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setWeekly(data.weekly || []);
    };

    // Insights: monthly
    const getMonthly = async () => {
        const res = await fetch(
            `${API}/api/insights/monthly/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setMonthly(data.monthly || []);
    };

    // Insights: success rate
    const getSuccessRate = async () => {
        const res = await fetch(
            `${API}/api/insights/success-rate/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setSuccessRate(data.successRate || 0);
    };

    useEffect(() => {
        getHabit();
        getHistory();
        getStreak();
        getWeekly();
        getMonthly();
        getSuccessRate();
    }, [id]);

    if (!habit)
        return <p className="text-center mt-10">Loading habit details...</p>;

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="mx-auto p-6 max-w-4xl">
                <div className="bg-white shadow p-6 rounded-xl">
                    <h1 className="text-3xl font-bold mb-2">{habit.name}</h1>
                    <p className="text-gray-600 mb-1">
                        Frequency: {habit.frequency.toUpperCase()}
                    </p>
                    <p className="text-gray-600 mb-1">Category: {habit.category}</p>
                    <p className="text-gray-600 mb-3">Priority: {habit.priority}</p>

                    <p className="font-semibold text-green-600 mb-5">
                        🔥 Current Streak: {streak} days
                    </p>

                    {/* Weekly Insights */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2 mt-6 text-gray-800">Weekly Progress</h2>
                        <div className="grid grid-cols-7 gap-2">
                            {weekly.map((data, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded text-center ${data.completed
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-300 text-gray-700"
                                        }`}
                                >
                                    {new Date(data.date).getDate()}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monthly Insights */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2 mt-6 text-gray-800">Monthly Progress</h2>
                        <div className="grid grid-cols-10 gap-1">
                            {monthly.map((day, index) => (
                                <div
                                    key={index}
                                    className={`p-2 rounded text-center text-xs ${day.completed
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-300 text-gray-700"
                                        }`}
                                >
                                    {new Date(day.date).getDate()}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Success Rate */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Success Rate</h2>
                        <p className="text-2xl font-bold text-purple-600">{successRate}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

