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
  const debounceQuery = useDebounce(inputValue, 300);
  const [suggestions, setSuggestions] = useState<searchSuggestionProps[]>([]);
  const [selectedChain, setSelectedChain] = useState(CHAIN_OPTIONS[0]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { checkScanAllowed, setHasScannedOnce } = useScanLimiterContext();
  const [selectedFromSuggestions, setSelectedFromSuggestions] = useState(false);
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

  useEffect(() => {
    if (selectedFromSuggestions) {
      setSelectedFromSuggestions(false);
      return;
    }

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
          .sort((a, b) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceQuery]);

  const clearMessageAfterDelay = () => {
    setTimeout(() => {
      setMessageType("");
      setMessage("");
    }, 5000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
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
        setContractInput(selected.id);
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

    // ✅ Limitu pārbaude
    const result = await checkScanAllowed();

    if (result.emailUnverified) {
      // ✅ Ir ievadīts e-pasts, bet nav verificēts
      setMessageType("error");
      setMessage("Please verify your email.");
      clearMessageAfterDelay();
      return;
    }

    if (!result.allowed) {
      if (result.emailRequired && !result.emailUnverified) {
        // ✅ Sasniegts limits, bet nav apstiprināšanas problēmas
        setShowEmailModal(true);
      } else {
        // ✅ Sasniegts limits un/vai bez e-pasta
        setMessageType("error");
        setMessage("You have reached your daily scan limit.");
        clearMessageAfterDelay();
      }
      return;
    }

    // ✅ Atļauts skanēt
    setHasScannedOnce(true);
    setIsLoading(true);
    setResult(undefined);
    setMessage("");
    setMessageType("");

    try {
      const startTime = Date.now();
      // ✅ Fetch NFT datus
      const res = await fetch("/api/fetch-nft-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractAddress: contractInput }),
      });

      const data = await res.json();

      if (!res.ok || data.error || !data.collectionData) {
        if (data.error) {
          console.error("Fetch error:", data.error);
        }
        setMessageType("error");
        setMessage("NFT collection not found or server error.");
        clearMessageAfterDelay();
        return;
      }

      setResult(data);
      setContractInput("");
      setInputValue("");

      // ✅ Saglabā skanējumu pēc fetch
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

  const handleEmailSubmit = async (email: string) => {
    const { ip, fingerprint, userAgent } = await getClientInfo();

    // ✅ Ja nav vēl subscriber — pievieno
    const { data: existingSubscriber } = await supabase
      .from("subscribers")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (!existingSubscriber) {
      await supabase.from("subscribers").insert({ email });
    }

    // ✅ Atjauno tikai e-pastu esošajā ierakstā (bez skaita palielināšanas)
    await supabase
      .from("scan_usage")
      .update({
        email,
        fingerprint,
        user_agent: userAgent,
      })
      .eq("ip_address", ip);

    // ✅ Atjauno augšējo joslu (scansLeft, emailRequired)
    await checkScanAllowed();

    // ✅ Aizver modal
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
      }, 100); // Notīra URL
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

          {suggestions.length > 0 && inputValue.length >= 2 && (
            <div className="absolute left-0 top-full -mt-16 pt-3 md:-mt-2 rounded-b-lg w-full bg-card shadow-lg -z-1 custom-scrollbar max-h-[300px]">
              {suggestions.map((collection, index) => (
                <div
                  key={collection.id}
                  onClick={() => {
                    setContractInput(collection.id);
                    setInputValue(collection.name || "");
                    setSuggestions([]);
                    setSelectedIndex(-1);
                    setSelectedFromSuggestions(true);
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
