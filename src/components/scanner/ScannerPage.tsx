"use client";

import { useEffect, useRef, useState } from "react";
import { ScannerResults } from "./ScannerResults";
import { useDebounce } from "@/lib/hooks/useDebounce";
import Image from "next/image";
import { ScannerResultsProps } from "@/types/apiTypes/globalApiTypes";
import { searchSuggestionProps } from "@/types/apiTypes/globalApiTypes";
import LoadingCardSkeleton from "../loadings/LoadingCardSceleton";

export default function ScannerPage() {
  const [contractInput, setContractInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScannerResultsProps>();
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 300);
  const [suggestions, setSuggestions] = useState<searchSuggestionProps[]>([]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    if (debounceQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    fetch(`/api/search?query=${debounceQuery}`)
      .then((res) => res.json())
      .then((data) => {
        const collections = data.collections || [];
        const input = debounceQuery.toLowerCase();

        const filtered = collections
          .filter(
            (c: searchSuggestionProps) =>
              c.name?.toLowerCase().includes(input) ||
              c.symbol?.toLowerCase().includes(input) ||
              c.collectionId?.toLowerCase().includes(input)
          )
          .sort((a: searchSuggestionProps, b: searchSuggestionProps) => {
            const aStarts = a.name?.toLowerCase().startsWith(input) ? -1 : 1;
            const bStarts = b.name?.toLowerCase().startsWith(input) ? -1 : 1;
            return aStarts - bStarts;
          });

        setSuggestions(filtered);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setSuggestions([]);
      });
  }, [debounceQuery]);

  const clearMessageAfterDelay = () => {
    setTimeout(() => {
      setMessageType("");
      setMessage("");
    }, 5000);
  };

  const handleScan = async () => {
    if (!contractInput.trim()) {
      setMessageType("error");
      setMessage("Enter contract address");
      clearMessageAfterDelay();
    }
    setIsLoading(true);
    setResult(undefined);

    try {
      const res = await fetch("/api/fetch-nft-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractAddress: contractInput }),
      });

      const data = await res.json();
      if (data.error) setMessageType(data.error);
      else {
        setResult(data);
        setContractInput("");
      }
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("Scan failed");
      clearMessageAfterDelay();
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center w-full py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">
        Scan NFT for Free
      </h1>

      <div
        ref={wrapperRef}
        className="relative z-10 flex flex-col md:flex-row gap-2 items-center bg-gray-800 p-2 rounded-lg w-full max-w-lg md:max-w-2xl"
      >
        <input
          type="text"
          placeholder="Enter NFT contract address or colection name"
          value={contractInput}
          onChange={(e) => {
            const value = e.target.value;
            setContractInput(value);
            setQuery(value);
          }}
          className="flex-grow w-full md:w-3/4 px-4 py-3 bg-gray-900 text-white rounded-lg outline-none border border-gray-700 focus:border-purple-500 transition relative z-10"
        />
        <button
          onClick={handleScan}
          disabled={isLoading}
          className={`bg-purple-500 hover:bg-purple-600 w-full md:w-1/4 px-6 py-3 rounded-lg text-white font-semibold transition whitespace-nowrap relative z-10 ${
            isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              Scanning
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          ) : (
            "Scan"
          )}
        </button>

        {suggestions.length > 0 && contractInput !== "" && (
          <div
            className="absolute top-full mt-1 w-full bg-[#1e293b] border border-gray-700 rounded-lg shadow-xl z-20
             scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800 max-h-[500px] overflow-auto"
          >
            {suggestions.map((collection) => (
              <div
                key={collection.id}
                onClick={() => {
                  setContractInput(collection.id);
                  setQuery("");
                  setSuggestions([]);
                }}
                className="flex items-center p-3 hover:bg-[#334155] cursor-pointer gap-3"
              >
                <Image
                  src={collection.image || "N/A"}
                  alt={collection.name || "N/A"}
                  width={32}
                  height={32}
                  className="rounded-md"
                  unoptimized
                />
                <div className="text-sm text-white">
                  <p className="font-medium">{collection.name}</p>
                  <p className="text-xs text-gray-400">{collection.symbol}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {messageType && (
        <p
          className={`mt-2 text-sm font-medium ${
            messageType === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      {isLoading ? (
        <LoadingCardSkeleton />
      ) : (
        result &&
        result.collectionData && (
          <ScannerResults
            contractAddress={result.contractAddress}
            collectionData={result.collectionData}
            washTradingAnalysis={result.washTradingAnalysis}
            rugPullAnalysis={result.rugPullAnalysis}
            safetyScore={result.safetyScore}
            riskLevel={result.riskLevel}
            whaleActivityAnalysis={result.whaleActivityAnalysis}
          />
        )
      )}
    </div>
  );
}
