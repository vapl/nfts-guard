"use client";

import React, { useState } from "react";

interface ScanFormProps {
  onSubmit: (input: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ScanForm: React.FC<ScanFormProps> = ({ onSubmit, loading, error }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-4 mb-6"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter NFT contract address or token ID"
        className="w-full bg-black/35 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder:text-gray-500"
      />
      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center text-nowrap"
      >
        {loading ? "Scanning..." : "Scan Now"}
      </button>
    </form>
  );
};

export default ScanForm;
