import React from "react";
import { useState } from "react";
import { api } from "../api/client.js";
import Card from "../components/Card";

export default function Jobs() {
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");

  const enqueueJob = async () => {
    const res = await api.post(
      "/jobs",
      { task: "email", to: "user@gmail.com" },
      { headers: { "x-api-key": apiKey } }
    );
    setMessage(res.data.jobId);
  };

  return (
    <Card title="Job Queue">
      <input
        className="input"
        placeholder="API Key"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
      />
      <button onClick={enqueueJob} className="btn mt-3">
        Enqueue Job
      </button>

      {message && <p className="mt-4">Job ID: {message}</p>}
    </Card>
  );
}
