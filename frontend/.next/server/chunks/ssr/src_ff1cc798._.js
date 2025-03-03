module.exports = {

"[project]/src/locales/en.json (json)": ((__turbopack_context__) => {

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"landing\":{\"hero-section\":{\"title\":\"Secure Your NFTs On-Chain\",\"description\":\"Launching soon! Try our FREE Demo Scan now and join the waitlist for full blockchain protection! Verify authenticity, detect scams instantly.\",\"input\":\"Enter NFT contract address or token ID\",\"cta\":\"Try Demo Scan\"}},\"general\":{\"language\":{\"label\":\"Language\",\"english\":\"English\",\"spanish\":\"Spanish\"}}}"));}}),
"[project]/src/locales/es.json (json)": ((__turbopack_context__) => {

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"landing\":{\"hero-section\":{\"title\":\"Asegura tus NFTs en la blockchain\",\"description\":\"¡Próximamente! Prueba nuestro escaneo de demostración GRATIS ahora y únete a la lista de espera para una protección completa en la blockchain. Verifica la autenticidad y detecta estafas al instante.\",\"input\":\"Ingresa la dirección del contrato NFT o el ID del token\",\"cta\":\"Probar escaneo de demostración\"}},\"general\":{\"language\":{\"label\":\"Idioma\",\"english\":\"Inglesa\",\"spanish\":\"Española\"}}}"));}}),
"[project]/src/utils/getTranslations.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
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
}}),
"[project]/src/components/TranslationWrapper.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/TranslationWrapper.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/TranslationWrapper.tsx <module evaluation>", "default");
}}),
"[project]/src/components/TranslationWrapper.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/TranslationWrapper.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/TranslationWrapper.tsx", "default");
}}),
"[project]/src/components/TranslationWrapper.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TranslationWrapper$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/TranslationWrapper.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TranslationWrapper$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/components/TranslationWrapper.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TranslationWrapper$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/[locale]/layout.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>LocaleLayout),
    "generateStaticParams": (()=>generateStaticParams)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getTranslations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/getTranslations.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TranslationWrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/TranslationWrapper.tsx [app-rsc] (ecmascript)");
;
;
;
function generateStaticParams() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getTranslations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["locales"].map((locale)=>({
            locale
        }));
}
async function LocaleLayout({ children, params }) {
    await params;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TranslationWrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/[locale]/layout.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
}}),

};

//# sourceMappingURL=src_ff1cc798._.js.map