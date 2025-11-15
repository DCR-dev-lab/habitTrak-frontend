import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API } from "../utils/api";

export default function Challenges() {
    const [challenges, setChallenges] = useState([]);
    const token = Cookies.get("token");
    const navigate = useNavigate();
    const [status, setStatus] = useState("");

    const loadChallenges = async () => {
        try {
            const res = await fetch(`${API}/api/challenge/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setChallenges(data.challenges || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleJoin = async (challengeId) => {
        setStatus("");
        try {
            const res = await fetch(`${API}/api/challenge/join`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ challengeId }),
            });
            const data = await res.json();
            if (!res.ok) {
                setStatus("❌ " + (data.message || "Failed to join"));
                return;
            }
            setStatus("✅ Joined challenge");
            // reload
            loadChallenges();
        } catch (err) {
            setStatus("❌ Something went wrong");
        }
    };

    useEffect(() => {
        loadChallenges();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Challenges</h1>

                {status && <p className="mb-3 text-center">{status}</p>}

                <button
                    onClick={() => navigate("/challenge/create")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Create Challenge
                </button>

                <div className="mt-6 space-y-4">
                    {challenges.map((c) => (
                        <div
                            key={c._id}
                            className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
                        >
                            <div>
                                <h2 className="text-xl font-semibold">{c.title}</h2>
                                <p className="text-gray-600">{c.description}</p>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/challenge/${c._id}`)}
                                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                    >
                                        View
                                    </button>

                                    <button
                                        onClick={() => handleJoin(c._id)}
                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Join
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
