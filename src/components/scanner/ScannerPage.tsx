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
import { useScanLimiterContext } from "@/context/ScanContext";
import EmailModal from "../modals/EmailModal";
import { supabase } from "@/lib/supabase/supabase";
import { useSaveScan } from "@/lib/hooks/useSaveScan";
import { getVerifiedEmail } from "@/lib/helpers/getVerifiedEmail";
import { getClientInfo } from "@/utils/getClientInfo";
import ScanStatusBar from "@/components/layout/ScannerStatusBar";

const CHAIN_OPTIONS = [
  { name: "Ethereum", value: "ethereum", icon: <FaEthereum size={24} /> },
  { name: "Solana (soon)", value: "solana", icon: <SiSolana size={24} /> },
  { name: "Polygon (soon)", value: "polygon", icon: <SiPolygon size={24} /> },
];

export default function ScannerPage() {
  const [inputValue, setInputValue] = useState("");
  const [contractInput, setContractInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [result, setResult] = useState<ScannerResultsProps>();
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const debounceQuery = useDebounce(inputValue.trim(), 250);
  const [suggestions, setSuggestions] = useState<searchSuggestionProps[]>([]);
  const [selectedChain, setSelectedChain] = useState(CHAIN_OPTIONS[0]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { checkScanAllowed, setHasScannedOnce } = useScanLimiterContext();
  const { saveScan } = useSaveScan();

  useEffect(() => {
    const handleOpenModal = () => setShowEmailModal(true);
    window.addEventListener("open-email-modal", handleOpenModal);
    return () =>
      window.removeEventListener("open-email-modal", handleOpenModal);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Caching search to Supabase and retrieving
  const selectedFromSuggestionsRef = useRef(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (
        selectedFromSuggestionsRef.current ||
        debounceQuery.trim().length < 2
      ) {
        selectedFromSuggestionsRef.current = false;
        setSuggestions([]);
        return;
      }

      const input = debounceQuery.toLowerCase();

      // 1. Search Supabase cache
      const { data: cached } = await supabase
        .from("search_cache_collections")
        .select("contract_address, name, symbol, image")
        .ilike("name", `%${input}%`)
        .limit(30);

      let results: searchSuggestionProps[] = [];

      if (cached && cached.length > 0) {
        results = cached.map((item) => ({
          id: item.contract_address,
          collectionId: item.contract_address, // fallback for type compatibility
          name: item.name,
          symbol: item.symbol,
          image: item.image,
        }));
      } else {
        // 2. Fallback to Reservoir API
        const res = await fetch(`/api/search?query=${debounceQuery}`);
        const json = await res.json();
        const apiResults = json.collections || [];

        results = apiResults.map((item) => ({
          id: item.id,
          collectionId: item.id, // fallback for type compatibility
          name: item.name,
          symbol: item.symbol,
          image: item.image,
        }));

        // 3. Cache in Supabase
        const insertData = results.map((c) => ({
          contract_address: c.id,
          name: c.name,
          symbol: c.symbol,
          image: c.image,
        }));

        if (insertData.length > 0) {
          const { data: existing } = await supabase
            .from("search_cache_collections")
            .select("contract_address")
            .in(
              "contract_address",
              insertData.map((d) => d.contract_address)
            );

          const existingAddresses = new Set(
            existing?.map((d) => d.contract_address)
          );

          const newEntries = insertData.filter(
            (d) => !existingAddresses.has(d.contract_address)
          );

          if (newEntries.length > 0) {
            await supabase.from("search_cache_collections").insert(newEntries);
          }
        }
      }

      setSuggestions(results);
    };

    fetchSuggestions();
  }, [debounceQuery]);

  const clearMessageAfterDelay = () => {
    setTimeout(() => {
      setMessageType("");
      setMessage("");
    }, 5000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Tab") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        const selected = suggestions[selectedIndex];
        selectedFromSuggestionsRef.current = true;
        setContractInput(selected.collectionId || selected.id);
        setInputValue(selected.name || "");
        setSuggestions([]);
        setSelectedIndex(-1);
      } else {
        handleScan();
        setSuggestions([]);
      }
    }
  };

  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  const handleScan = async () => {
    if (!contractInput || contractInput.trim() === "") {
      setMessageType("error");
      setMessage("Please enter a contract address.");
      clearMessageAfterDelay();
      return;
    }

    const error = getValidationError(
      "address",
      contractInput,
      selectedChain.value
    );
    if (error) {
      setMessageType("error");
      setMessage(error);
      clearMessageAfterDelay();
      return;
    }

    setHasScannedOnce(true);
    setResult(undefined);
    setMessage("");
    setMessageType("");
    setSuggestions([]);

    const result = await checkScanAllowed();
    if (result.emailUnverified) {
      setMessageType("error");
      setMessage("Please verify your email.");
      clearMessageAfterDelay();
      return;
    }

    if (!result.allowed) {
      if (result.emailRequired && !result.emailUnverified) {
        setShowEmailModal(true);
      } else {
        setMessageType("error");
        setMessage("You have reached your daily scan limit.");
        clearMessageAfterDelay();
      }
      return;
    }
    setIsLoading(true);

    try {
      const startTime = Date.now();
      const res = await fetch("/api/fetch-nft-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractAddress: contractInput }),
      });

      const data = await res.json();

      if (!res.ok || data.error || !data.collectionData) {
        if (data.error) console.error("Fetch error:", data.error);
        setMessageType("error");
        setMessage("NFT collection not found or server error.");
        clearMessageAfterDelay();
        return;
      }

      setResult(data);
      setContractInput("");
      setInputValue("");

      const ip = await fetch("/api/user-ip").then((res) => res.text());
      const email = await getVerifiedEmail();
      const duration = Date.now() - startTime;

      await saveScan(ip, email, "success", null, contractInput, duration);
    } catch (err) {
      console.error("Scanner error:", err);
      setMessageType("error");
      setMessage("Scan failed. Please try again later.");
      clearMessageAfterDelay();
    }

    setIsLoading(false);
  };

  // === Email submit === //
  const handleEmailSubmit = async (email: string) => {
    const { ip, fingerprint, userAgent } = await getClientInfo();

    await supabase
      .from("scan_usage")
      .update({ email, fingerprint, user_agent: userAgent })
      .eq("ip_address", ip);

    await checkScanAllowed();
    setShowEmailModal(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const verified = params.get("verified");
    const error = params.get("error");

    if (verified) {
      setMessage("Your email has been verified successfully!");
      setMessageType("success");
      setTimeout(() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }, 100);
      clearMessageAfterDelay();
    }

    if (error === "invalid_or_used") {
      setMessage("Invalid or expired verification link.");
      setMessageType("error");
      setTimeout(() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }, 100);
      clearMessageAfterDelay();
    }

    if (error === "missing_token") {
      setMessage("Missing or malformed verification link.");
      setMessageType("error");
      setTimeout(() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }, 100);
      clearMessageAfterDelay();
    }
  }, []);

  return (
    <>
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
      />
      <div className="relative flex flex-col items-center w-full py-12 px-3 pt-36 z-10">
        <div className="mb-8 flex flex-col items-end">
          <Badge name="beta" className="text-xs px-3 py-0.5 self-end" />
          <div className="text-center mb-4">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-heading">
              Scan <span className="text-accent-purple">NFTs</span> stay{" "}
              <span className="text-accent-purple">Safe</span>
            </h2>
            <p className="text-lg text-paragraph mt-2">
              Scan 1 collection instantly. No wallet. No signup.
            </p>
          </div>
          <ScanStatusBar />
        </div>

        <div
          ref={wrapperRef}
          className="relative flex flex-col md:flex-row gap-2 items-center bg-card p-2 rounded-lg w-full max-w-lg md:max-w-2xl drop-shadow-lg"
        >
          {messageType && (
            <p
              className={`absolute bottom-full left-1/2 transform -translate-x-1/2 pb-2 text-sm font-medium z-60 ${
                messageType === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

          <Input
            type="text"
            placeholder="Enter NFT contract address or colection name"
            value={inputValue}
            onKeyDown={handleKeyDown}
            iconLeft={
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
                            setDropdownOpen(false);
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
            }
            onChange={(e) => {
              const value = e.target.value;
              setInputValue(value);
              setContractInput(value);
            }}
          />

          {suggestions.length > 0 && inputValue.length >= 1 && (
            <div className="absolute left-0 top-full -mt-16 pt-3 md:-mt-2 rounded-b-lg w-full bg-card shadow-lg -z-1 custom-scrollbar max-h-[300px]">
              {suggestions.map((collection, index) => (
                <div
                  key={collection.collectionId || collection.id || index}
                  onClick={() => {
                    selectedFromSuggestionsRef.current = true;
                    setInputValue(collection.name || "");
                    setContractInput(collection.collectionId || collection.id);
                    setSuggestions([]);
                    setSelectedIndex(-1);
                  }}
                  className={`flex items-center p-3 cursor-pointer gap-3 ${
                    index === selectedIndex
                      ? "bg-indigo-400 dark:bg-purple-600"
                      : "hover:bg-indigo-400 dark:hover:bg-purple-600"
                  }`}
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
                    <p className="text-xs text-paragraph">
                      {collection.id?.slice(0, 6) +
                        "..." +
                        collection.id?.slice(-4)}
                      {collection.collectionId?.slice(0, 6)}
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
            onClick={handleScan}
            className="relative w-full md:w-1/4 !-z-10"
          />
        </div>
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
