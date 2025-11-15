import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import Navbar from "../components/Navbar";
import { API } from "../utils/api";


export default function CreateHabit() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        frequency: "daily",
        category: "general",
        priority: "low",
    });

    const [error, setError] = useState("");

    const token = Cookies.get("token");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${API}/api/habits`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to create habit");
                return;
            }

            navigate("/dashboard");
        } catch (error) {
            setError("Something went wrong");
            console.log("Error creating habit:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center w-full px-4">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 shadow-lg rounded-xl w-full max-w-md"
                >
                    <h1 className="text-2xl font-bold mb-6 text-gray-700">
                        Create New Habit
                    </h1>

                    {error && (
                        <p className="text-red-500 text-center mb-3">{error}</p>
                    )}

                    <label className="block mb-3">
                        <span className="text-gray-600">Habit Name</span>
                        <input
                            type="text"
                            name="name"
                            className="w-full p-2 border rounded mt-1"
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="block mb-3">
                        <span className="text-gray-600">Frequency</span>
                        <select
                            name="frequency"
                            className="w-full p-2 border rounded mt-1"
                            onChange={handleChange}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </label>

                    <label className="block mb-3">
                        <span className="text-gray-600">Category</span>
                        <input
                            type="text"
                            name="category"
                            className="w-full p-2 border rounded mt-1"
                            onChange={handleChange}
                            defaultValue="general"
                        />
                    </label>

                    <label className="block mb-5">
                        <span className="text-gray-600">Priority</span>
                        <select
                            name="priority"
                            className="w-full p-2 border rounded mt-1"
                            onChange={handleChange}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </label>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Add Habit
                    </button>
                </form>
            </div>
        </div>
    );
}
