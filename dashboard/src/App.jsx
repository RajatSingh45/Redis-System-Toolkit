import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Clients from "./pages/Clients";
import RateLimit from "./pages/RateLimit";
import Jobs from "./pages/Jobs";
import Leaderboard from "./pages/Leaderboard";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Clients />} />
            <Route path="/rate-limit" element={<RateLimit />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
