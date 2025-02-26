"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useScan } from "@/context/ScanContext";
import ScanForm from "../ScanForm";
import ScanResultsFree from "../FreeScanResult";

interface FreeScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
  onUpgrade: () => void;
}

const FreeScanModal: React.FC<FreeScanModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  onUpgrade,
}) => {
  const { results, scanNFT, clearResults, error, isLoading } = useScan();
  const [formSubmitted, setFormSubmitted] = useState(false);

  // NFT scan function
  const handleScan = async (input: string) => {
    await scanNFT(input);
    setFormSubmitted(true);
  };

  // Modal aizvēršana
  const handleClose = () => {
    clearResults();
    setFormSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 text-white rounded-xl p-8 w-full max-w-4xl shadow-xl relative animate-fade-in m-6 overflow-y-auto max-h-[90vh] scrollbar-hide">
        {/* Aizvēršanas poga */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        {/* Modāla virsraksts */}
        <h2 className="text-3xl font-bold mb-6">Free NFT Scan</h2>

        {/* 1️⃣ Skenēšanas forma */}
        {!formSubmitted && results ? (
          <ScanForm onSubmit={handleScan} loading={isLoading} error={error} />
        ) : (
          <>
            {/* Results after successfull scan */}
            {results?.length > 0 ? (
              <>
                <ScanResultsFree results={results} />

                {/* CTA: Registration and Premium */}
                <div className="mt-6 items-center">
                  <p className="text-gray-400 text-sm mb-4">
                    Enjoyed your free scan? Register for 3 daily scans or
                    upgrade to Premium for unlimited access!
                  </p>
                  <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4">
                    <button
                      onClick={onRegister}
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg w-full"
                    >
                      Register for Free
                    </button>
                    <button
                      onClick={onUpgrade}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-lg w-full"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p></p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FreeScanModal;
