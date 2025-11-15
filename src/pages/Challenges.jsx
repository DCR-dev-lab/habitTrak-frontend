import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Trophy,
    Plus,
    Users,
    Calendar,
    CheckCircle,
    Eye,
    Zap,
    Target,
    Award,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { API } from "../utils/api";

export default function Challenges() {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = Cookies.get("token");
    const navigate = useNavigate();
    const [status, setStatus] = useState({ type: "", message: "" });
    const [joiningIds, setJoiningIds] = useState([]);

    const loadChallenges = async () => {
        try {
            const res = await fetch(`${API}/api/challenge/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setChallenges(data.challenges || []);

            console.log("Loaded challenges:", data.challenges);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const loadMyChallenges = async () => {
        try {
            const res = await fetch(`${API}/api/challenge/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            const myChallengeIds = data.challenges.map((c) => c._id);

            console.log("My Challenge IDs:", myChallengeIds);
            setJoiningIds(myChallengeIds);

        } catch (err) {
            console.error(err);
        }
    };

    const handleJoin = async (challengeId) => {
        setStatus({ type: "", message: "" });

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
                setStatus({
                    type: "error",
                    message: data.message || "Failed to join challenge",
                });
                toast.error(data.message || "Failed to join challenge");
                return;
            }

            toast.success("Successfully joined challenge!");
            setStatus({ type: "success", message: "Successfully joined challenge!" });

            // Update joined list
            setJoiningIds((prev) => [...prev, challengeId]);

            loadChallenges();

            setTimeout(() => setStatus({ type: "", message: "" }), 3000);

        } catch (err) {
            setStatus({ type: "error", message: "Something went wrong" });
            console.error(err);
        }
    };


    useEffect(() => {
        loadChallenges();
        loadMyChallenges();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-8">
                    <p className="text-gray-600 text-lg">Loading challenges...</p>
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

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <Trophy className="w-10 h-10 text-indigo-600" />
                            Challenges
                        </h1>
                        <p className="text-gray-600">
                            Join challenges and compete with others to build better habits
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/challenge/create")}
                        className="cursor-pointer flex items-center justify-center gap-2 backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-indigo-500/30 whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        Create Challenge
                    </button>
                </div>

                {/* Status Message */}
                {status.message && (
                    <div
                        className={`backdrop-blur-xl border-2 rounded-2xl px-6 py-4 mb-6 flex items-center gap-3 ${status.type === "success"
                            ? "bg-green-100/80 border-green-300/50"
                            : "bg-red-100/80 border-red-300/50"
                            }`}
                    >
                        {status.type === "success" ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                            <Trophy className="w-6 h-6 text-red-600" />
                        )}
                        <p
                            className={`font-medium ${status.type === "success" ? "text-green-700" : "text-red-700"
                                }`}
                        >
                            {status.message}
                        </p>
                    </div>
                )}

                {/* Challenges Grid */}
                {challenges.length === 0 ? (
                    <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-3xl p-12 text-center">
                        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            No Challenges Yet
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Be the first to create a challenge and invite others!
                        </p>
                        <button
                            onClick={() => navigate("/challenge/create")}
                            className="backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                        >
                            Create First Challenge
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {challenges.map((challenge) => (
                            <div
                                key={challenge.id}
                                className="group backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                            >
                                {/* Challenge Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl">
                                                <Trophy className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {challenge.title}
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 text-sm line-clamp-2">
                                            {challenge.description || "No description provided"}
                                        </p>
                                    </div>
                                </div>

                                {/* Challenge Stats */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {/* Participants */}
                                    <div className="flex items-center gap-1.5 backdrop-blur-xl bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg">
                                        <Users className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-semibold text-blue-700">
                                            {challenge.participantsCount || 0} joined
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/challenge/${challenge.id}`)}
                                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 backdrop-blur-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-700 font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>

                                    <button
                                        onClick={() => handleJoin(challenge.id)}
                                        disabled={joiningIds.includes(challenge.id)}
                                        className="cursor-pointer  flex-1 flex items-center justify-center gap-2 backdrop-blur-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-green-500/20 disabled:cursor-not-allowed"
                                    >
                                        {joiningIds.includes(challenge.id) ? (
                                            <>
                                                Joined
                                            </>
                                        ) : (
                                            <>
                                                <Award className="w-4 h-4" />
                                                Join
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Card */}
                {challenges.length > 0 && (
                    <div className="mt-8 backdrop-blur-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Target className="w-5 h-5 text-indigo-600" />
                            Challenge Tips
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Join challenges that align with your goals</li>
                            <li>• Check the leaderboard regularly for motivation</li>
                            <li>• Invite friends to make it more fun</li>
                            <li>• Stay consistent to climb the ranks</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}