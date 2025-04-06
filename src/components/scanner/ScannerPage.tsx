"use client";

import { useEffect, useRef, useState } from "react";
import { ScannerResults } from "./ScannerResults";
import { useDebounce } from "@/lib/hooks/useDebounce";
import Image from "next/image";
import { ScannerResultsProps } from "@/types/apiTypes/globalApiTypes";
import { searchSuggestionProps } from "@/types/apiTypes/globalApiTypes";
import LoadingCardSkeleton from "../loadings/LoadingCardSceleton";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import { MdOutlineHideImage } from "react-icons/md";
import { FaEthereum } from "react-icons/fa";
import { SiSolana, SiPolygon } from "react-icons/si";
import { getValidationError } from "@/utils/validation";
import Badge from "../ui/Badge";

const CHAIN_OPTIONS = [
  { name: "Ethereum", value: "ethereum", icon: <FaEthereum size={24} /> },
  { name: "Solana (soon)", value: "solana", icon: <SiSolana size={24} /> },
  { name: "Polygon (soon)", value: "polygon", icon: <SiPolygon size={24} /> },
];

export default function ScannerPage() {
  const [contractInput, setContractInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScannerResultsProps>();
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 300);
  const [suggestions, setSuggestions] = useState<searchSuggestionProps[]>([]);
  const [selectedChain, setSelectedChain] = useState(CHAIN_OPTIONS[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    // 1. Validācija no formas
    const error = getValidationError(
      "address",
      contractInput,
      selectedChain.value
    );
    if (error) {
      setMessageType("error");
      setMessage(error); // <-- Invalid address formāts
      clearMessageAfterDelay();
      return;
    }

    // 2. Tīri viss, sāk fetch
    setIsLoading(true);
    setResult(undefined);
    setMessage("");
    setMessageType("");

    try {
      const res = await fetch("/api/fetch-nft-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractAddress: contractInput }),
      });

      const data = await res.json();

      // 3. API kļūda vai nav kolekcijas
      if (!res.ok || data.error) {
        setMessageType("error");
        setMessage("Server error occurred. Please try again.");
        clearMessageAfterDelay();
        return;
      }

      if (!data.collectionData) {
        setMessageType("error");
        setMessage("NFT collection not found. Try another address.");
        clearMessageAfterDelay();
        return;
      }

      // 4. Panākums!
      setResult(data);
      setContractInput("");
    } catch (err) {
      console.error("Scanner error:", err);
      setMessageType("error");
      setMessage("Scan failed. Please try again later.");
      clearMessageAfterDelay();
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="relative flex flex-col items-center w-full py-12 px-3 pt-36 z-10">
        <div className="mb-4 flex flex-col items-end">
          <Badge name="beta" className="text-xs px-3 py-0.5 self-end" />
          <div className="text-center mb-4">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-heading">
              Scan <span className="text-accent-purple">NFTs</span> stay{" "}
              <span className="text-accent-purple">Safe</span>
            </h2>
            <p className="text-lg text-paragraph mt-4">
              Scan 1 collection instantly. No wallet. No signup.
            </p>
          </div>
        </div>

        <div
          ref={wrapperRef}
          className="relative flex flex-col md:flex-row gap-2 items-center bg-card p-2 rounded-lg w-full max-w-lg md:max-w-2xl drop-shadow-lg"
        >
          <Input
            type="text"
            placeholder="Enter NFT contract address or colection name"
            value={contractInput}
            iconLeft={
              <>
                {/* Chain selector */}
                <div ref={dropdownRef} className="relative ">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className={`flex items-center gap-0 px-1 py-0.5 ${
                      contractInput
                        ? "text-purple-500"
                        : "hover:text-purple-500 text-gray-400"
                    } cursor-pointer`}
                  >
                    {selectedChain.icon}
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute -left-3 mt-3 bg-card p-2 rounded-b-lg z-50 drop-shadow-lg">
                      {CHAIN_OPTIONS.map((chain) => {
                        const isDisabled = chain.name !== "Ethereum";
                        return (
                          <button
                            key={chain.name}
                            onClick={() => {
                              if (isDisabled) return;
                              setSelectedChain(chain);
                              setDropdownOpen(false); // close after click
                            }}
                            className={`flex items-center text-nowrap gap-3 px-2 py-2 w-full text-left text-sm cursor-pointer hover:bg-accent ${
                              chain.value !== "ethereum"
                                ? "cursor-not-allowed opacity-60"
                                : "text-gray-400 hover:text-purple-500"
                            }`}
                          >
                            {chain.icon} {chain.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            }
            onChange={(e) => {
              const value = e.target.value;
              setContractInput(value);
              setQuery(value);
            }}
          />

          {suggestions.length > 0 && contractInput !== "" && (
            <div
              className="absolute left-0 top-full -mt-16 md:-mt-2 rounded-b-lg w-full bg-card shadow-lg -z-1
             custom-scrollbar max-h-[300px]"
            >
              {suggestions.map((collection) => (
                <div
                  key={collection.id}
                  onClick={() => {
                    setContractInput(collection.id);
                    setQuery("");
                    setSuggestions([]);
                  }}
                  className="flex items-center p-3 hover:bg-indigo-400 dark:hover:bg-purple-600 cursor-pointer gap-3"
                >
                  {collection.image ? (
                    <Image
                      src={collection.image}
                      alt={collection.name || "N/A"}
                      width={32}
                      height={32}
                      className="rounded-md"
                      unoptimized
                    />
                  ) : (
                    <MdOutlineHideImage size={32} className="text-gray-400" />
                  )}

                  <div className="text-sm text-paragraph">
                    <p className="font-medium">{collection.name}</p>
                    <p className="text-xs text-paragraph">
                      {collection.symbol}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            label="Scan"
            loadingLabel="Scanning"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={() => {
              if (isLoading) return;
              handleScan();
            }}
            className="relative w-full md:w-1/4 !-z-10"
          />
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
      </div>
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
    </>
  );
}
