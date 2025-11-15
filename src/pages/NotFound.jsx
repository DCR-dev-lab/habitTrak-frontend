import { useNavigate } from "react-router-dom";
import { Ghost, ArrowLeft } from "lucide-react";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-100 relative overflow-hidden">

            {/* Glow Blobs */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply blur-3xl opacity-20"></div>
            <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply blur-3xl opacity-20"></div>

            {/* Card */}
            <div className="backdrop-blur-xl bg-white/40 border border-white/30 shadow-2xl p-10 rounded-3xl max-w-md w-full flex flex-col items-center text-center animate-fadeIn">

                <Ghost className="w-16 h-16 text-indigo-600 mb-4" />

                <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>

                <p className="text-lg text-gray-700 mb-6">
                    Oops! The page you’re looking for doesn’t exist.
                </p>

                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Go Home
                </button>
            </div>
        </div>
    );
}
