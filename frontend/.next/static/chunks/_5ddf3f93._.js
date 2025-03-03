(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_5ddf3f93._.js", {

"[project]/src/context/TranslationContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "TranslationProvider": (()=>TranslationProvider),
    "useTranslations": (()=>useTranslations)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const TranslationContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function TranslationProvider({ children, locale, messages }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TranslationContext.Provider, {
        value: {
            locale,
            messages
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/TranslationContext.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_c = TranslationProvider;
function useTranslations() {
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(TranslationContext);
    if (!context) {
        throw new Error("useTranslations must be used within a TranslationProvider");
    }
    const { messages, locale } = context;
    const t = (key)=>{
        return key.split(".").reduce((obj, part)=>{
            if (typeof obj === "string" || !obj) return key;
            return obj[part] || key;
        }, messages);
    };
    return {
        t,
        locale
    };
}
_s(useTranslations, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "TranslationProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/locales/en.json (json)": ((__turbopack_context__) => {

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"landing\":{\"hero-section\":{\"title\":\"Secure Your NFTs On-Chain\",\"description\":\"Launching soon! Try our FREE Demo Scan now and join the waitlist for full blockchain protection! Verify authenticity, detect scams instantly.\",\"input\":\"Enter NFT contract address or token ID\",\"cta\":\"Try Demo Scan\"}},\"general\":{\"language\":{\"label\":\"Language\",\"english\":\"English\",\"spanish\":\"Spanish\"}}}"));}}),
"[project]/src/locales/es.json (json)": ((__turbopack_context__) => {

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"landing\":{\"hero-section\":{\"title\":\"Asegura tus NFTs en la blockchain\",\"description\":\"¡Próximamente! Prueba nuestro escaneo de demostración GRATIS ahora y únete a la lista de espera para una protección completa en la blockchain. Verifica la autenticidad y detecta estafas al instante.\",\"input\":\"Ingresa la dirección del contrato NFT o el ID del token\",\"cta\":\"Probar escaneo de demostración\"}},\"general\":{\"language\":{\"label\":\"Idioma\",\"english\":\"Inglesa\",\"spanish\":\"Española\"}}}"));}}),
"[project]/src/utils/getTranslations.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "getTranslations": (()=>getTranslations),
    "locales": (()=>locales)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/en.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$es$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/es.json (json)");
;
;
const locales = [
    "en",
    "es"
];
const translations = {
    en: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2e$json__$28$json$29$__["default"],
    es: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$es$2e$json__$28$json$29$__["default"]
};
function getTranslations(locale) {
    const messages = translations[locale];
    if (!messages) {
        throw new Error(`Translations for locale '${locale}' not found.`);
    }
    return messages;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/TranslationWrapper.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>TranslationWrapper)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$TranslationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/TranslationContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getTranslations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/getTranslations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function TranslationWrapper({ children }) {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])(); // Pieņemam, ka locale var būt undefined
    const locale = params?.locale;
    if (!locale || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getTranslations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["locales"].includes(locale)) {
        throw new Error("Invalid locale");
    }
    const messages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getTranslations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTranslations"])(locale);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$TranslationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TranslationProvider"], {
        locale: locale,
        messages: messages,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/TranslationWrapper.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_s(TranslationWrapper, "+jVsTcECDRo3yq2d7EQxlN9Ixog=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = TranslationWrapper;
var _c;
__turbopack_context__.k.register(_c, "TranslationWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=_5ddf3f93._.js.map