import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useState } from "react";
import { Sparkles, LayoutDashboard, Plus, Trophy, User, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const logout = () => {
        Cookies.remove("token");
        navigate("/login");
    };

    // FIXED: handleNavClick was missing
    const handleNavClick = (path) => {
        navigate(path);
        setOpen(false); // close menu on mobile
    };

    return (
        <nav className="fixed top-0 z-50 w-full">
            {/* Glass Navbar */}
            <div className="backdrop-blur-xl bg-white/70 border-b border-gray-200/50 shadow-lg shadow-gray-900/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <button
                            onClick={() => handleNavClick('/')}
                            className="flex items-center gap-2 group cursor-pointer"
                        >
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                HabitTracker
                            </span>
                        </button>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => handleNavClick('/')}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 font-medium cursor-pointer"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </button>

                            <button
                                onClick={() => handleNavClick('/create-habit')}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 font-medium cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                Add Habit
                            </button>

                            <button
                                onClick={() => handleNavClick('/challenges')}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 font-medium cursor-pointer"
                            >
                                <Trophy className="w-4 h-4" />
                                Challenges
                            </button>

                            <button
                                onClick={() => handleNavClick('/profile')}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 font-medium cursor-pointer"
                            >
                                <User className="w-4 h-4" />
                                Profile
                            </button>

                            {/* Logout Button */}
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 ml-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="md:hidden p-2 rounded-xl hover:bg-gray-100/50 transition-colors cursor-pointer"
                        >
                            {open ? (
                                <X className="w-6 h-6 text-gray-700 cursor-pointer" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="px-4 py-4 space-y-2 border-t border-gray-200/50 bg-white/50 backdrop-blur-xl">
                        <button
                            onClick={() => handleNavClick('/')}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 font-medium"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </button>

                        <button
                            onClick={() => handleNavClick('/create-habit')}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Add Habit
                        </button>

                        <button
                            onClick={() => handleNavClick('/challenges')}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 font-medium"
                        >
                            <Trophy className="w-5 h-5" />
                            Challenges
                        </button>

                        <button
                            onClick={() => handleNavClick('/profile')}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 font-medium"
                        >
                            <User className="w-5 h-5" />
                            Profile
                        </button>

                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg shadow-red-500/20"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
