import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Navbar() {
    const navigate = useNavigate();

    const logout = () => {
        Cookies.remove("token");
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky  w-full top-0 z-20">
            {/* Logo */}
            <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
                HabitTracker
            </Link>

            {/* Links */}
            <div className="flex gap-6">
                <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                    Dashboard
                </Link>

                <Link
                    to="/create-habit"
                    className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                    Add Habit
                </Link>

                <Link
                    to="/challenges"
                    className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                    Challenges
                </Link>

                <Link
                    to="/profile"
                    className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                    Profile
                </Link>


                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
