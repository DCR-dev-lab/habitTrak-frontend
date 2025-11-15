import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";

import { API } from "../utils/api";

export default function ChallengeLeaderboard() {
    const { id } = useParams();
    const token = Cookies.get("token");

    const [leaderboard, setLeaderboard] = useState([]);
    const [title, setTitle] = useState("");

    const loadLeaderboard = async () => {
        const res = await fetch(
            `${API}/api/challenge/leaderboard/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await res.json();

        if (data.leaderboard) {
            setLeaderboard(data.leaderboard);
        }

        if (data.challengeTitle) {
            setTitle(data.challengeTitle);
        }
    };

    useEffect(() => {
        loadLeaderboard();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">
                    Challenge Leaderboard
                </h1>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">
                        {title || "Leaderboard"}
                    </h2>

                    {leaderboard.length === 0 ? (
                        <p className="text-gray-600 text-center">No participants yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {leaderboard.map((p, index) => (
                                <div
                                    key={p.user._id}
                                    className="p-4 bg-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-200 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl font-bold text-gray-700">
                                            #{index + 1}
                                        </span>
                                        <p className="text-lg font-medium text-gray-800">
                                            {p.user.username}
                                        </p>
                                    </div>

                                    <p className="text-blue-600 font-semibold text-lg">
                                        ⭐ {p.score}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
