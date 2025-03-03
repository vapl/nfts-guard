(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_context_ScanContext_tsx_5e3aeb47._.js", {

"[project]/src/context/ScanContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ScanProvider": (()=>ScanProvider),
    "useScan": (()=>useScan)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const ScanContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ScanProvider = ({ children })=>{
    _s();
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Mock NFT scan function
    const scanNFT = async (input)=>{
        setIsLoading(true);
        setError(null);
        // Simulē skenēšanu (mock API)
        setTimeout(()=>{
            if (input.trim()) {
                setResults([
                    {
                        id: "1",
                        name: "CryptoPunk",
                        tokenId: "1234",
                        contract: input,
                        image: "/images/CryptoPunks.webp",
                        currentPrice: 100,
                        lastSale: 90,
                        collectionFloor: 80,
                        rarityRank: 1,
                        totalSupply: 10000,
                        safetyScore: 95
                    }
                ]);
            } else {
                setError("Invalid contract address or token ID.");
            }
            setIsLoading(false);
        }, 1500);
    };
    const clearResults = ()=>{
        setResults([]);
        setError(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScanContext.Provider, {
        value: {
            results,
            isLoading,
            error,
            scanNFT,
            clearResults
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/ScanContext.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
};
_s(ScanProvider, "kh2MMGjFexugGNZinUHgYuIqB8M=");
_c = ScanProvider;
const useScan = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ScanContext);
    if (!context) {
        throw new Error("useScan must be used within a ScanProvider");
    }
    return context;
};
_s1(useScan, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ScanProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_context_ScanContext_tsx_5e3aeb47._.js.map