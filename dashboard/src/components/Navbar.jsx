import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 flex gap-6">
      <Link to="/" className="hover:text-blue-400">Clients</Link>
      <Link to="/rate-limit" className="hover:text-blue-400">Rate Limit</Link>
      <Link to="/jobs" className="hover:text-blue-400">Jobs</Link>
      <Link to="/leaderboard" className="hover:text-blue-400">Leaderboard</Link>
    </nav>
  );
}
