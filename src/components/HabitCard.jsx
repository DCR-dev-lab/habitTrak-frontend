import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function HabitCard({ habit }) {
    const navigate = useNavigate();
    const [streak, setStreak] = useState(0);
    const token = Cookies.get("token");

    // Get streak for each habit
    const getStreak = async () => {
        const res = await fetch(
            `http://localhost:3000/api/checkin/streak/${habit._id}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        const data = await res.json();
        setStreak(data.streak || 0);
    };

    // Mark today's check-in
    const markToday = async () => {
        await fetch("http://localhost:3000/api/checkin/mark", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ habitId: habit._id }),
        });
        getStreak();
    };

    // Unmark today's check-in
    const unmarkToday = async () => {
        await fetch("http://localhost:3000/api/checkin/uncheck", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ habitId: habit._id }),
        });
        getStreak();
    };

    useEffect(() => {
        getStreak();
    }, []);

    return (
        <div onClick={() => navigate(`/habit/${habit._id}`)}
            className="p-5 bg-white shadow-md hover:shadow-lg rounded-xl border border-gray-200 transition-all duration-200 hover:scale-[1.02]">
            <h2 className="text-xl font-semibold mb-2">{habit.name}</h2>
            <p className="text-gray-600 mb-3">
                Frequency: {habit.frequency.toUpperCase()}
            </p>

            <p className="font-semibold text-green-600 mb-3">
                🔥 Streak: {streak} days
            </p>

            <div className="flex gap-2">
                <button
                    onClick={markToday}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"

                >
                    Mark Today
                </button>

                <button
                    onClick={unmarkToday}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"

                >
                    Undo
                </button>
            </div>
        </div>
    );
}
