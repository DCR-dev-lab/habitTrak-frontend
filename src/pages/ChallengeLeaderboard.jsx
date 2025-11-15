import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
    Trophy,
    Medal,
    Award,
    Crown,
    Star,
    TrendingUp,
    Users,
    ArrowLeft,
    Flame,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { API } from "../utils/api";

export default function ChallengeLeaderboard() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = Cookies.get("token");

    const [leaderboard, setLeaderboard] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);

    const loadLeaderboard = async () => {
        try {
            const res = await fetch(`${API}/api/challenge/leaderboard/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            console.log("Leaderboard data:", data);

            if (data.leaderboard) {
                setLeaderboard(data.leaderboard);
            }

            if (data.challengeTitle) {
                setTitle(data.challengeTitle);
            }

            // You might want to get current user ID from your auth context
            // For now, we'll leave it as null
            setLoading(false);
        } catch (error) {
            console.error("Error loading leaderboard:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeaderboard();
    }, [id]);

    // Get initials from username
    const getInitials = (username) => {
        if (!username) return "?";
        return username
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Get rank badge style
    const getRankBadgeStyle = (rank) => {
        if (rank === 1)
            return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
        if (rank === 2)
            return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
        if (rank === 3)
            return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
        return "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700";
    };

    // Get trophy icon for top 3
    const getTrophyIcon = (rank) => {
        if (rank === 1)
            return <Crown className="w-6 h-6 text-yellow-500" fill="currentColor" />;
        if (rank === 2) return <Trophy className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <Award className="w-6 h-6 text-orange-500" />;
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-8">
                    <p className="text-gray-600 text-lg">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    const topThree = leaderboard.slice(0, 3);
    const restOfLeaderboard = leaderboard.slice(3);
    const maxScore = leaderboard[0]?.score || 100;

    return (
        <div className="min-h-screen relative overflow-hidden pt-16">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 -z-10"></div>
            <div className="fixed top-20 right-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
            <div className="fixed bottom-20 left-20 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>

            <Navbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/challenges")}
                    className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Challenges</span>
                </button>

                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-xl">
                        <Trophy className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
                    <p className="text-xl text-gray-600">{title || "Challenge Rankings"}</p>
                </div>

                {leaderboard.length === 0 ? (
                    /* Empty State */
                    <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-3xl p-12 text-center">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            No Participants Yet
                        </h2>
                        <p className="text-gray-600">
                            Be the first to join this challenge and claim the top spot!
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Podium for Top 3 */}
                        {topThree.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-end justify-center gap-4 mb-8">
                                    {/* 2nd Place */}
                                    {topThree[1] && (
                                        <div className="flex flex-col items-center flex-1 max-w-[200px]">
                                            <div className="backdrop-blur-xl bg-white/60 border-2 border-gray-300 rounded-2xl p-6 w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] mb-2">
                                                <div className="flex justify-center mb-3">
                                                    <Trophy className="w-12 h-12 text-gray-400" />
                                                </div>
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center mx-auto mb-3 text-white font-bold text-xl shadow-lg">
                                                    {getInitials(topThree[1].user.username)}
                                                </div>
                                                <h3 className="font-bold text-gray-900 text-center mb-1 truncate">
                                                    {topThree[1].user.username}
                                                </h3>
                                                <div className="flex items-center justify-center gap-1 text-gray-600">
                                                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                                    <span className="font-semibold">{topThree[1].score}</span>
                                                </div>
                                            </div>
                                            <div className="w-full h-20 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-xl"></div>
                                        </div>
                                    )}

                                    {/* 1st Place */}
                                    {topThree[0] && (
                                        <div className="flex flex-col items-center flex-1 max-w-[220px] -mt-8">
                                            <div className="backdrop-blur-xl bg-white/60 border-2 border-yellow-400 rounded-2xl p-6 w-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] mb-2 relative">
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg">
                                                        <Crown className="w-6 h-6 text-white" fill="currentColor" />
                                                    </div>
                                                </div>
                                                <div className="flex justify-center mb-3 mt-2">
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-50"></div>
                                                        <Trophy className="relative w-14 h-14 text-yellow-500" fill="currentColor" />
                                                    </div>
                                                </div>
                                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-3 text-white font-bold text-2xl shadow-xl">
                                                    {getInitials(topThree[0].user.username)}
                                                </div>
                                                <h3 className="font-bold text-gray-900 text-center mb-1 text-lg truncate">
                                                    {topThree[0].user.username}
                                                </h3>
                                                <div className="flex items-center justify-center gap-1 text-yellow-600">
                                                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                                    <span className="font-bold text-lg">{topThree[0].score}</span>
                                                </div>
                                            </div>
                                            <div className="w-full h-32 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-t-xl shadow-lg"></div>
                                        </div>
                                    )}

                                    {/* 3rd Place */}
                                    {topThree[2] && (
                                        <div className="flex flex-col items-center flex-1 max-w-[200px]">
                                            <div className="backdrop-blur-xl bg-white/60 border-2 border-orange-300 rounded-2xl p-6 w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] mb-2">
                                                <div className="flex justify-center mb-3">
                                                    <Award className="w-12 h-12 text-orange-500" />
                                                </div>
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto mb-3 text-white font-bold text-xl shadow-lg">
                                                    {getInitials(topThree[2].user.username)}
                                                </div>
                                                <h3 className="font-bold text-gray-900 text-center mb-1 truncate">
                                                    {topThree[2].user.username}
                                                </h3>
                                                <div className="flex items-center justify-center gap-1 text-orange-600">
                                                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                                    <span className="font-semibold">{topThree[2].score}</span>
                                                </div>
                                            </div>
                                            <div className="w-full h-16 bg-gradient-to-b from-orange-400 to-orange-600 rounded-t-xl"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Rest of Rankings */}
                        {restOfLeaderboard.length > 0 && (
                            <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-3xl p-6 shadow-xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                                    <h2 className="text-xl font-bold text-gray-900">Rankings</h2>
                                </div>

                                <div className="space-y-3">
                                    {restOfLeaderboard.map((participant, index) => {
                                        const rank = index + 4;
                                        const isCurrentUser =
                                            currentUserId && participant.user._id === currentUserId;
                                        const scorePercentage = (participant.score / maxScore) * 100;

                                        return (
                                            <div
                                                key={participant.user._id}
                                                className={`backdrop-blur-xl bg-white/40 border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${isCurrentUser
                                                        ? "border-indigo-400 bg-indigo-50/50"
                                                        : "border-gray-200"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    {/* Rank Badge */}
                                                    <div
                                                        className={`w-10 h-10 rounded-lg ${getRankBadgeStyle(
                                                            rank
                                                        )} flex items-center justify-center font-bold shadow-md flex-shrink-0`}
                                                    >
                                                        {rank}
                                                    </div>

                                                    {/* Avatar */}
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                                                        {getInitials(participant.user.username)}
                                                    </div>

                                                    {/* User Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 truncate">
                                                            {participant.user.username}
                                                            {isCurrentUser && (
                                                                <span className="ml-2 text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                                                                    You
                                                                </span>
                                                            )}
                                                        </h3>
                                                        {/* Progress Bar */}
                                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                            <div
                                                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                                                style={{ width: `${scorePercentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    {/* Score */}
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <Flame
                                                            className="w-5 h-5 text-orange-500"
                                                            fill="currentColor"
                                                        />
                                                        <span className="font-bold text-gray-900 text-lg">
                                                            {participant.score}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Info Card */}
                {leaderboard.length > 0 && (
                    <div className="mt-6 backdrop-blur-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Medal className="w-5 h-5 text-yellow-600" />
                            How Rankings Work
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Complete your habits daily to earn points</li>
                            <li>• Maintain streaks for bonus multipliers</li>
                            <li>• Rankings update in real-time</li>
                            <li>• The top 3 get special recognition!</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}