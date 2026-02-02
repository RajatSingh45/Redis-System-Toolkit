import React from "react";
import { useState } from "react";
import { api } from "../api/client.js";
import Card from "../components/Card";

export default function RateLimit() {
  const [clientId, setClientId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [result, setResult] = useState("");

  const testApi = async () => {
    try {
      const res = await api.get(`/clients/client/${clientId}`, {
        headers: { "x-api-key": apiKey },
      });
      setResult(JSON.stringify(res.data));
    } catch (err) {
      setResult(err.response?.status + " Rate Limited");
    }
  };

  return (
    <Card title="Rate Limit Test">
      <input
        className="input"
        placeholder="Client ID"
        value={clientId}
        onChange={e => setClientId(e.target.value)}
      />
      <input
        className="input mt-2"
        placeholder="API Key"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
      />
      <button onClick={testApi} className="btn mt-3">
        Call Protected API
      </button>

      <pre className="mt-4 text-sm">{result}</pre>
    </Card>
  );
}
