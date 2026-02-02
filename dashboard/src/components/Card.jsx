import React from "react";
export default function Card({ title, children }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
