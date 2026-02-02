import React from "react";
import { useState } from "react";
import { api } from "../api/client.js";
import Card from "../components/Card";

export default function Clients() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");

  const createClient = async () => {
    const res = await api.post("/clients/createClient", { id, name });
    setApiKey(res.data.apiKey);
  };

  const rotateKey = async () => {
    const res = await api.post(
      `/clients/rotateKey/${id}`,
      {},
      { headers: { "x-api-key": apiKey } }
    );
    setApiKey(res.data.newKey);
  };

  return (
    <Card title="Client & API Key">
      <input
        className="input"
        placeholder="Client ID"
        value={id}
        onChange={e => setId(e.target.value)}
      />
      <input
        className="input mt-2"
        placeholder="Client Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={createClient} className="btn mt-3">
        Create Client
      </button>

      {apiKey && (
        <>
          <p className="mt-4 break-all">API Key: {apiKey}</p>
          <button onClick={rotateKey} className="btn mt-2 bg-yellow-600">
            Rotate Key
          </button>
        </>
      )}
    </Card>
  );
}
