// "use client";

// import React, { useState } from "react";
// import mockNFTResults from "@/data/mockNFTResults";
// import { NftData } from "@/types/___nftDataTypes";
// import {
//   FaExclamationTriangle,
//   FaCheckCircle,
//   FaChartLine,
// } from "react-icons/fa";
// import { getNFTCollectionData } from "@/lib/nft";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function NFTScanner() {
//   const [nftInput, setNftInput] = useState("");
//   const [isScanning, setIsScanning] = useState(false);
//   const [result, setResult] = useState<NftData | null>(null);

//   const washTradingData = [
//     { day: "Mon", percentage: 5 },
//     { day: "Tue", percentage: 10 },
//     { day: "Wed", percentage: 15 },
//     { day: "Thu", percentage: 20 },
//     { day: "Fri", percentage: 25 },
//     { day: "Sat", percentage: 15 },
//     { day: "Sun", percentage: 10 },
//   ];

//   const handleScan = async () => {
//     const validContractOrToken = /^0x[a-fA-F0-9]{40}$|^[0-9]+$/;
//     const validUrl = /^(https?:\/\/)?(www\.)?opensea\.io\/assets\/.+/;

//     if (!validContractOrToken.test(nftInput) && !validUrl.test(nftInput)) {
//       alert("Please enter a valid contract address, token ID, or OpenSea URL");
//       return;
//     }

//     setIsScanning(true);
//     try {
//       const collectionData = await getNFTCollectionData(nftInput);

//       const newResult: NftData = {
//         id: "nft-id", // Ja nepieciešams, pielāgo
//         name: collectionData.name || "Unknown NFT",
//         tokenId: nftInput,
//         image: collectionData.logoUrl || "/nft_placeholder.png",
//         contract: collectionData.contractAddress,
//         owner: "Unknown", // Pielāgo, ja nepieciešams
//         isVerifiedContract: true,
//         hasHiddenFunctions: false,
//         currentPrice: 0,
//         lastSale: 0,
//         collectionFloor: Number(collectionData.floorPrice) || 0,
//         priceSymbol: collectionData.priceSymbol || "ETH",
//         floorPrice: Number(collectionData?.floorPrice),
//         priceCurrency: String(collectionData.priceCurrency),
//         marketCap: String(collectionData.marketCap),
//         uniqueOwners: Number(collectionData.uniqueOwners),

//         safetyScore: {
//           score: 80,
//           reason: [{ factor: "Contract Age", impact: "Low" }],
//         },

//         whaleHolders: {
//           percentage: "5%",
//           suspiciousActivity: {
//             detected: false,
//             reason: "No whale manipulations detected",
//           },
//         },

//         washTradingRisk: {
//           level: "Medium",
//           percentage: "15%",
//           detectedInTransactions: 5,
//           reason: "Detected multiple ping-pong trades",
//         },

//         marketDepth: {
//           bidAskSpread: "N/A",
//           depthAnalysis: "No data",
//         },

//         liquidity: {
//           liquidityScore: "Medium",
//           avgTimeOnMarket: "2 days",
//           totalTrades: 50,
//         },

//         traderReputation: {
//           reputationScore: "Stable",
//           activeTraders: 1200,
//           newTraders: 300,
//           newTraderPercentage: "25%",
//         },

//         userReports: {
//           reportCount: 0,
//           reports: [],
//         },
//       };

//       setResult(newResult);
//     } catch (error) {
//       console.error("❌ Error scanning NFT:", error);
//     }
//     setIsScanning(false);
//   };

//   return (
//     <section className="flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-br from-gray-900 to-gray-800 py-10">
//       <h1 className="text-4xl md:text-5xl font-bold mb-6">NFT Scanner</h1>
//       <p className="text-gray-400 text-lg mb-6 max-w-xl text-center">
//         Enter an NFT contract address or token ID to check its details and
//         safety.
//       </p>

//       <div className="flex flex-col md:flex-row gap-4 w-full max-w-xl mb-8">
//         <input
//           type="text"
//           placeholder="Enter NFT contract address or token ID (e.g., 567)"
//           value={nftInput}
//           onChange={(e) => setNftInput(e.target.value)}
//           className="w-full px-5 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={handleScan}
//           className="bg-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-blue-300"
//           disabled={isScanning}
//         >
//           {isScanning ? "Scanning..." : "Scan"}
//         </button>
//       </div>

//       {/* SCAN RESULT */}
//       {result && (
//         <div className="w-full max-w-3xl bg-gray-900 rounded-lg p-6 shadow-lg">
//           <h2 className="text-2xl font-bold mb-4">{result.name}</h2>
//           <p className="text-gray-400 text-sm mb-4">
//             Contract: {result.contract}
//           </p>

//           {result.image ? (
//             <img
//               src={result.image}
//               alt={result.name}
//               className="w-32 h-32 rounded-lg mx-auto mb-4 shadow-md"
//             />
//           ) : (
//             <div className="w-32 h-32 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center text-gray-400">
//               No Image
//             </div>
//           )}

//           {/* Main stats */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
//             <div className="p-4 bg-gray-800 rounded-lg">
//               <span className="text-gray-400">Current Price</span>
//               <p className="text-xl font-semibold">{result.currentPrice} ETH</p>
//             </div>
//             <div className="p-4 bg-gray-800 rounded-lg">
//               <span className="text-gray-400">Last Sale</span>
//               <p className="text-xl font-semibold">{result.lastSale} ETH</p>
//             </div>
//             <div className="p-4 bg-gray-800 rounded-lg">
//               <span className="text-gray-400">Collection Floor</span>
//               <p className="text-xl font-semibold">{result.floorPrice} ETH</p>
//             </div>
//           </div>

//           {/* Risk Analysis */}
//           <div className="mt-6">
//             <h3 className="text-lg font-semibold mb-2">Risk Analysis</h3>
//             <div className="p-4 bg-gray-800 rounded-lg">
//               <p className="flex items-center gap-2">
//                 {result.washTradingRisk.level ? (
//                   <FaExclamationTriangle className="text-red-500" />
//                 ) : (
//                   <FaCheckCircle className="text-green-500" />
//                 )}
//                 <p
//                   className="flex items-center gap-2"
//                   title="Wash trading ir mākslīgi darījumi, kas rada ilūziju par lielāku tirgus aktivitāti"
//                 >
//                   Wash Trading Risk: {result.washTradingRisk.level}
//                 </p>
//               </p>
//               <p className="text-gray-400 text-sm">
//                 {result.washTradingRisk.percentage}
//               </p>
//             </div>
//             <div className="mt-6 p-4 bg-gray-800 rounded-lg">
//               <h3 className="text-lg font-semibold mb-2">
//                 Wash Trading Trends
//               </h3>
//               <ResponsiveContainer width="100%" height={200}>
//                 <LineChart data={washTradingData}>
//                   <XAxis dataKey="day" stroke="#8884d8" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="percentage"
//                     stroke="#8884d8"
//                     strokeWidth={2}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="p-4 bg-gray-800 rounded-lg mt-3">
//               <p className="flex items-center gap-2">
//                 <FaExclamationTriangle className="text-yellow-500" />
//                 Whale Activity: {result.whaleHolders.percentage}
//               </p>
//             </div>
//             <div className="p-4 bg-gray-800 rounded-lg mt-3">
//               <p className="flex items-center gap-2">
//                 {result.traderReputation ? (
//                   <FaExclamationTriangle className="text-orange-500" />
//                 ) : (
//                   <FaCheckCircle className="text-green-500" />
//                 )}
//                 Trader Reputation: {result.traderReputation.reputationScore}
//               </p>
//             </div>
//           </div>

//           {/* Market & Liquidity */}
//           <div className="mt-6">
//             <h3 className="text-lg font-semibold mb-2">Market & Liquidity</h3>
//             <div className="p-4 bg-gray-800 rounded-lg">
//               <p className="flex items-center gap-2">
//                 <FaChartLine className="text-blue-500" />
//                 Bid-Ask Spread: {result.marketDepth.bidAskSpread}
//               </p>
//               <p className="text-gray-400 text-sm">
//                 {result.marketDepth.depthAnalysis}
//               </p>
//             </div>
//           </div>

//           {/* User Reports */}
//           <div className="p-4 bg-gray-800 rounded-lg mt-3">
//             <p className="flex items-center gap-2">
//               <FaExclamationTriangle className="text-red-500" />
//               User Reports: {result.userReports?.reportCount || 0}
//             </p>
//           </div>

//           {/* Show Full Report */}
//           <div className="mt-6 text-center">
//             <button className="px-6 py-3 bg-blue-500 rounded-lg font-semibold hover:bg-blue-600">
//               Show Full Report
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }
