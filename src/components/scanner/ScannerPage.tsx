"use client";

import { useEffect, useRef, useState } from "react";
import { ScannerResults } from "./ScannerResults";
import { useDebounce } from "@/lib/hooks/useDebounce";
import Image from "next/image";
import { ScannerResultsProps } from "@/types/apiTypes/globalApiTypes";
import { searchSuggestionProps } from "@/types/apiTypes/globalApiTypes";
import LoadingCardSkeleton from "../loadings/LoadingCardSceleton";
import Button from "../ui/Button";
import Input from "../ui/Input";

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
    <div className="flex flex-col items-center w-full py-12 px-2">
      <h1 className="text-2xl md:text-3xl font-bold text-heading">
        Scan NFT for Free (beta)
      </h1>
      <p className="text-paragraph text-sm mb-4">
        *Limited to 5 scans per month on free plan
      </p>

      <div
        ref={wrapperRef}
        className="relative z-10 flex flex-col md:flex-row gap-2 items-center bg-card p-2 rounded-lg w-full max-w-lg md:max-w-2xl drop-shadow-lg"
      >
        <Input
          type="text"
          placeholder="Enter NFT contract address or colection name"
          value={contractInput}
          onChange={(e) => {
            const value = e.target.value;
            setContractInput(value);
            setQuery(value);
          }}
        />

        <Button
          label="Scan"
          loadingLabel="Scanning"
          isLoading={isLoading}
          disabled={isLoading}
          onClick={handleScan}
          className="w-full md:w-1/4"
        />

        {suggestions.length > 0 && contractInput !== "" && (
          <div
            className="absolute top-full mt-1 w-full bg-card border border-gray-300 rounded-lg drop-shadow-xl z-20
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
                className="flex items-center p-3 hover:bg-gray-200 dark:hover:bg-[#334155] cursor-pointer gap-3"
              >
                <Image
                  src={collection.image || "N/A"}
                  alt={collection.name || "N/A"}
                  width={32}
                  height={32}
                  className="rounded-md"
                  unoptimized
                />
                <div className="text-sm text-paragraph">
                  <p className="font-medium">{collection.name}</p>
                  <p className="text-xs text-paragraph">{collection.symbol}</p>
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

      {isLoading && !messageType ? (
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
