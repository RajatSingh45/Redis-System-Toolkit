import React from "react";
import { useState } from "react";
import { api } from "../api/client.js";
import Card from "../components/Card";

export default function Leaderboard() {
  const [data, setData] = useState([]);

  const loadLeaderboard = async () => {
    const res = await api.get("/leaderboard/page?page=1&size=10");
    setData(res.data.data.data);
  };

  return (
    <Card title="Leaderboard">
      <button onClick={loadLeaderboard} className="btn">
        Load Leaderboard
      </button>

      <ul className="mt-4">
        {data.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
