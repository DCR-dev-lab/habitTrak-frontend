import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import { API } from "../utils/api";

export default function ChallengeCreate() {
    const navigate = useNavigate();
    const token = Cookies.get("token");

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [status, setStatus] = useState("");

    const handleCreate = async (e) => {
        e.preventDefault();

        setStatus("");

        try {
            const res = await fetch(`${API}}/api/challenge/create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description: desc,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus("❌ " + (data.message || "Failed to create challenge"));
                return;
            }

            setStatus("✅ Challenge created successfully!");

            setTimeout(() => {
                navigate("/challenges");
            }, 900);
        } catch (err) {
            setStatus("❌ Something went wrong");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-lg mx-auto mt-10 bg-white p-8 shadow-lg rounded-xl">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Create Challenge
                </h1>

                {status && <p className="mb-4 text-center">{status}</p>}

                <form onSubmit={handleCreate}>
                    <label className="block mb-3">
                        <span className="text-gray-600">Title</span>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>

                    <label className="block mb-4">
                        <span className="text-gray-600">Description</span>
                        <textarea
                            className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
                            rows="3"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </label>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
}
