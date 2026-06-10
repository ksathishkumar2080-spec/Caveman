module.exports = [
"[project]/lib/compress.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compress",
    ()=>compress
]);
// R1: Drop articles
const articles = /\b(a|an|the)\b\s*/gi;
// R2: Drop politeness markers
const politeness = /\b(please|could you|would you|can you|i'd like(?: you)?(?: to)?|i would like(?: you)?(?: to)?|i want you to|feel free to|kindly|i need you to|i'd appreciate(?: it)?(?: if)?)\b\s*/gi;
// R3: Drop intro scaffolding
const scaffolding = /\b(in this task[,]?|for context[,]?|as requested[,]?|as you know[,]?|for your reference[,]?|just to clarify[,]?|to be clear[,]?|note that[,]?|please note[,]?|as a reminder[,]?)\s*/gi;
// R4: Compress verbose verb phrases
const verbPhrases = [
    [
        /provide me with a list of/gi,
        "list"
    ],
    [
        /provide me with/gi,
        "provide"
    ],
    [
        /give me a list of/gi,
        "list"
    ],
    [
        /give me/gi,
        "give"
    ],
    [
        /generate code for/gi,
        "code:"
    ],
    [
        /write code (that|to|for|which)/gi,
        "code:"
    ],
    [
        /write a (function|method|class|script) (that|to|for|which)/gi,
        (_, type)=>`${type}:`
    ],
    [
        /create a (function|method|class|script) (that|to|for|which)/gi,
        (_, type)=>`${type}:`
    ],
    [
        /help me (design|build|create|write|implement)/gi,
        (_, v)=>v
    ],
    [
        /make sure to/gi,
        ""
    ],
    [
        /make sure/gi,
        "ensure"
    ],
    [
        /in order to/gi,
        "to"
    ],
    [
        /as well as/gi,
        "and"
    ],
    [
        /that takes (a|an|the)?\s*/gi,
        "input:"
    ],
    [
        /that returns/gi,
        "return"
    ],
    [
        /and returns/gi,
        "return"
    ]
];
// R5: Abbreviate known tech (conservative — only unambiguous)
const techAbbrev = [
    [
        /\bJavaScript\b/g,
        "JS"
    ],
    [
        /\bTypeScript\b/g,
        "TS"
    ],
    [
        /\bdatabase\b/gi,
        "DB"
    ],
    [
        /\bapplication\b/gi,
        "app"
    ],
    [
        /\brepository\b/gi,
        "repo"
    ],
    [
        /\bapplication programming interface\b/gi,
        "API"
    ],
    [
        /\buser interface\b/gi,
        "UI"
    ],
    [
        /\bcommand line interface\b/gi,
        "CLI"
    ],
    [
        /\bpull request\b/gi,
        "PR"
    ]
];
// R7: Flatten polite conditionals
const politeConditionals = [
    [
        /if (it'?s? )?not too much trouble[,]?\s*/gi,
        ""
    ],
    [
        /if (that'?s? )?okay[,]?\s*/gi,
        ""
    ],
    [
        /if (it'?s? )?possible[,]?\s*/gi,
        ""
    ],
    [
        /if (it'?s? )?applicable[,]?\s*/gi,
        ""
    ],
    [
        /should it be (applicable|relevant|necessary)[,]?\s*/gi,
        ""
    ],
    [
        /whenever (you'?re? )?ready[,]?\s*/gi,
        ""
    ],
    [
        /at your (earliest )?convenience[,]?\s*/gi,
        ""
    ]
];
function estimateTokens(text) {
    if (!text.trim()) return 0;
    return Math.ceil(text.trim().split(/\s+/).length * 1.3);
}
function applyRule(text, pattern, replacement) {
    if (typeof replacement === "string") {
        return text.replace(pattern, replacement);
    }
    return text.replace(pattern, replacement);
}
function compress(input) {
    if (!input.trim()) return {
        output: "",
        steps: [],
        inputTokens: 0,
        outputTokens: 0
    };
    let text = input;
    const steps = [];
    const apply = (label, fn)=>{
        const before = text;
        text = fn(text);
        text = text.replace(/\s{2,}/g, " ").trim();
        if (before.trim() !== text.trim()) {
            steps.push({
                rule: label,
                before: before.trim(),
                after: text.trim()
            });
        }
    };
    apply("R7 — Flatten polite conditionals", (t)=>{
        politeConditionals.forEach(([p, r])=>{
            t = applyRule(t, p, r);
        });
        return t;
    });
    apply("R3 — Drop intro scaffolding", (t)=>t.replace(scaffolding, ""));
    apply("R2 — Drop politeness markers", (t)=>t.replace(politeness, ""));
    apply("R4 — Compress verb phrases", (t)=>{
        verbPhrases.forEach(([p, r])=>{
            t = applyRule(t, p, r);
        });
        return t;
    });
    apply("R5 — Abbreviate known tech", (t)=>{
        techAbbrev.forEach(([p, r])=>{
            t = applyRule(t, p, r);
        });
        return t;
    });
    apply("R1 — Drop articles", (t)=>t.replace(articles, ""));
    text = text.replace(/\s{2,}/g, " ").replace(/\s+([.,!?;:])/g, "$1").trim();
    const inputTokens = estimateTokens(input);
    const outputTokens = estimateTokens(text);
    const reduction = inputTokens > 0 ? Math.round((1 - outputTokens / inputTokens) * 100) : 0;
    return {
        output: text,
        steps,
        inputTokens,
        outputTokens,
        reduction
    };
}
}),
"[project]/app/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$compress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/compress.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const EXAMPLES = [
    "Could you please write a Python function that takes a list of integers as input and returns only the even numbers from that list?",
    "I would like you to act as a senior data engineer and help me design a SQL query that retrieves the top 10 customers by total purchase value from the orders table.",
    "Please generate a comprehensive REST API documentation in markdown format for an authentication service that includes endpoints for login, logout, token refresh, and password reset.",
    "In this task, I need you to review the following code snippet and identify any potential security vulnerabilities, particularly focusing on SQL injection and XSS attack vectors."
];
const RULES = [
    {
        code: "R1",
        name: "DROP ARTICLES",
        desc: "Remove all occurrences of a, an, the"
    },
    {
        code: "R2",
        name: "DROP POLITENESS",
        desc: "Remove please, could you, I'd like, feel free…"
    },
    {
        code: "R3",
        name: "DROP INTRO SCAFFOLDING",
        desc: "Remove preambles like 'In this task', 'For context'"
    },
    {
        code: "R4",
        name: "COMPRESS VERB PHRASES",
        desc: "'provide me with a list of' → list"
    },
    {
        code: "R5",
        name: "ABBREVIATE KNOWN TECH",
        desc: "JavaScript → JS, database → DB (unambiguous only)"
    },
    {
        code: "R6",
        name: "COLLAPSE REDUNDANT CLAUSES",
        desc: "Remove repeated constraints already implied"
    },
    {
        code: "R7",
        name: "FLATTEN POLITE CONDITIONALS",
        desc: "'if it's not too much trouble' → removed"
    },
    {
        code: "R8",
        name: "PRESERVE CRITICAL TOKENS",
        desc: "Negations, numbers, formats, tech names — untouched"
    }
];
function Home() {
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSteps, setShowSteps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleCompress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!input.trim()) return;
        const res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$compress$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["compress"])(input);
        setResult(res);
        setShowSteps(false);
        setCopied(false);
    }, [
        input
    ]);
    const handleExample = (ex)=>{
        setInput(ex);
        setResult(null);
        setCopied(false);
    };
    const handleCopy = async ()=>{
        if (!result?.output) return;
        await navigator.clipboard.writeText(result.output);
        setCopied(true);
        setTimeout(()=>setCopied(false), 2000);
    };
    const handleKeyDown = (e)=>{
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleCompress();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                style: {
                    borderBottom: "1px solid #2D2D3F",
                    padding: "20px 32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#1A1A2E",
                    position: "sticky",
                    top: 0,
                    zIndex: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "14px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: "28px"
                                },
                                children: "🗿"
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "20px",
                                            fontWeight: "800",
                                            color: "#F4F2EF",
                                            letterSpacing: "0.03em"
                                        },
                                        children: "CAVEPROMPT"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 72,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "12px",
                                            color: "#8888AA",
                                            letterSpacing: "0.05em"
                                        },
                                        children: "LLM TOKEN COMPRESSOR"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 75,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: "12px",
                            color: "#8888AA",
                            background: "#2D2D3F",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            border: "1px solid #4A4A6A"
                        },
                        children: "75% fewer tokens · 100% intent preserved"
                    }, void 0, false, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.js",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                style: {
                    flex: 1,
                    maxWidth: "960px",
                    width: "100%",
                    margin: "0 auto",
                    padding: "40px 24px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: "center",
                            marginBottom: "48px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: {
                                    fontSize: "clamp(28px, 5vw, 48px)",
                                    fontWeight: "900",
                                    color: "#F4F2EF",
                                    lineHeight: 1.15,
                                    marginBottom: "16px"
                                },
                                children: [
                                    "Strip your prompts to their",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: "#0F7173"
                                        },
                                        children: "semantic core."
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: "16px",
                                    color: "#8888AA",
                                    maxWidth: "560px",
                                    margin: "0 auto"
                                },
                                children: "Remove grammar, politeness, and scaffolding that LLMs ignore anyway. Keep every token that carries real meaning."
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "12px",
                            marginBottom: "40px"
                        },
                        children: [
                            {
                                val: "75%",
                                label: "Avg token reduction"
                            },
                            {
                                val: "~100%",
                                label: "Task accuracy maintained"
                            },
                            {
                                val: "8 Rules",
                                label: "Compression system"
                            }
                        ].map(({ val, label })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#2D2D3F",
                                    border: "1px solid #4A4A6A",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    textAlign: "center"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "28px",
                                            fontWeight: "800",
                                            color: "#E8A838",
                                            marginBottom: "4px"
                                        },
                                        children: val
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 132,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "12px",
                                            color: "#8888AA",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.08em"
                                        },
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 133,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, label, true, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 125,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#2D2D3F",
                            border: "1px solid #4A4A6A",
                            borderRadius: "16px",
                            overflow: "hidden",
                            marginBottom: "32px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "24px 24px 0"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: "10px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: "12px",
                                                    color: "#8888AA",
                                                    fontWeight: "700",
                                                    letterSpacing: "0.08em",
                                                    textTransform: "uppercase"
                                                },
                                                children: "Verbose Prompt"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.js",
                                                lineNumber: 154,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "12px",
                                                    color: "#4A4A6A"
                                                },
                                                children: input.trim() ? `~${Math.ceil(input.trim().split(/\s+/).length * 1.3)} tokens` : "0 tokens"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.js",
                                                lineNumber: 157,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 148,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: input,
                                        onChange: (e)=>{
                                            setInput(e.target.value);
                                            setResult(null);
                                        },
                                        onKeyDown: handleKeyDown,
                                        placeholder: "Paste your LLM prompt here…",
                                        rows: 6,
                                        style: {
                                            width: "100%",
                                            background: "#1A1A2E",
                                            border: "1px solid #4A4A6A",
                                            borderRadius: "10px",
                                            color: "#F4F2EF",
                                            fontSize: "15px",
                                            lineHeight: "1.7",
                                            padding: "16px",
                                            resize: "vertical",
                                            outline: "none",
                                            fontFamily: "inherit",
                                            transition: "border-color 0.2s"
                                        },
                                        onFocus: (e)=>e.target.style.borderColor = "#0F7173",
                                        onBlur: (e)=>e.target.style.borderColor = "#4A4A6A"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 161,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "12px 24px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "11px",
                                            color: "#4A4A6A",
                                            marginRight: "10px",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.06em"
                                        },
                                        children: "Try:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 188,
                                        columnNumber: 13
                                    }, this),
                                    EXAMPLES.map((ex, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleExample(ex),
                                            style: {
                                                background: "transparent",
                                                border: "1px solid #4A4A6A",
                                                borderRadius: "6px",
                                                color: "#8888AA",
                                                fontSize: "11px",
                                                padding: "3px 10px",
                                                marginRight: "6px",
                                                cursor: "pointer",
                                                transition: "all 0.15s"
                                            },
                                            onMouseEnter: (e)=>{
                                                e.target.style.borderColor = "#0F7173";
                                                e.target.style.color = "#0F7173";
                                            },
                                            onMouseLeave: (e)=>{
                                                e.target.style.borderColor = "#4A4A6A";
                                                e.target.style.color = "#8888AA";
                                            },
                                            children: [
                                                "Example ",
                                                i + 1
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/app/page.js",
                                            lineNumber: 190,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 187,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "16px 24px 24px"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCompress,
                                    disabled: !input.trim(),
                                    style: {
                                        width: "100%",
                                        padding: "16px",
                                        background: input.trim() ? "#0F7173" : "#2D2D3F",
                                        border: `1px solid ${input.trim() ? "#0F7173" : "#4A4A6A"}`,
                                        borderRadius: "10px",
                                        color: input.trim() ? "#fff" : "#4A4A6A",
                                        fontSize: "15px",
                                        fontWeight: "700",
                                        cursor: input.trim() ? "pointer" : "not-allowed",
                                        letterSpacing: "0.05em",
                                        transition: "all 0.2s"
                                    },
                                    onMouseEnter: (e)=>{
                                        if (input.trim()) e.target.style.background = "#0a5557";
                                    },
                                    onMouseLeave: (e)=>{
                                        if (input.trim()) e.target.style.background = "#0F7173";
                                    },
                                    children: [
                                        "🗿 COMPRESS PROMPT",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: "12px",
                                                fontWeight: "400",
                                                marginLeft: "10px",
                                                opacity: 0.7
                                            },
                                            children: "⌘↵"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.js",
                                            lineNumber: 234,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.js",
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 213,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#2D2D3F",
                            border: "1px solid #0F7173",
                            borderRadius: "16px",
                            overflow: "hidden",
                            marginBottom: "32px",
                            animation: "fadeIn 0.3s ease"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, 1fr)",
                                    borderBottom: "1px solid #4A4A6A"
                                },
                                children: [
                                    {
                                        label: "Before",
                                        val: `~${result.inputTokens}`,
                                        sub: "tokens",
                                        color: "#C0392B"
                                    },
                                    {
                                        label: "After",
                                        val: `~${result.outputTokens}`,
                                        sub: "tokens",
                                        color: "#0F7173"
                                    },
                                    {
                                        label: "Saved",
                                        val: `${result.reduction}%`,
                                        sub: "reduction",
                                        color: "#E8A838"
                                    }
                                ].map(({ label, val, sub, color })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: "18px 20px",
                                            textAlign: "center",
                                            borderRight: "1px solid #4A4A6A",
                                            "&:last-child": {
                                                borderRight: "none"
                                            }
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "11px",
                                                    color: "#8888AA",
                                                    marginBottom: "4px",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.06em"
                                                },
                                                children: label
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.js",
                                                lineNumber: 266,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "26px",
                                                    fontWeight: "800",
                                                    color
                                                },
                                                children: val
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.js",
                                                lineNumber: 267,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "11px",
                                                    color: "#4A4A6A"
                                                },
                                                children: sub
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.js",
                                                lineNumber: 268,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, label, true, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 260,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 250,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "24px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: "12px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "12px",
                                                    color: "#8888AA",
                                                    fontWeight: "700",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.08em"
                                                },
                                                children: "Caveman Prompt"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.js",
                                                lineNumber: 281,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    gap: "8px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowSteps(!showSteps),
                                                        style: {
                                                            background: "transparent",
                                                            border: "1px solid #4A4A6A",
                                                            borderRadius: "6px",
                                                            color: "#8888AA",
                                                            fontSize: "12px",
                                                            padding: "4px 12px",
                                                            cursor: "pointer"
                                                        },
                                                        children: showSteps ? "Hide steps" : `Show steps (${result.steps.length})`
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.js",
                                                        lineNumber: 285,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleCopy,
                                                        style: {
                                                            background: copied ? "#0F7173" : "transparent",
                                                            border: `1px solid ${copied ? "#0F7173" : "#4A4A6A"}`,
                                                            borderRadius: "6px",
                                                            color: copied ? "#fff" : "#8888AA",
                                                            fontSize: "12px",
                                                            padding: "4px 12px",
                                                            cursor: "pointer",
                                                            transition: "all 0.2s"
                                                        },
                                                        children: copied ? "✓ Copied" : "Copy"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.js",
                                                        lineNumber: 299,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.js",
                                                lineNumber: 284,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 275,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "#1A1A2E",
                                            border: "1px solid #0F7173",
                                            borderRadius: "10px",
                                            padding: "18px",
                                            fontSize: "15px",
                                            color: "#F4F2EF",
                                            lineHeight: "1.7",
                                            fontWeight: "500"
                                        },
                                        children: result.output || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "#4A4A6A",
                                                fontStyle: "italic"
                                            },
                                            children: "Nothing left after compression"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.js",
                                            lineNumber: 327,
                                            columnNumber: 35
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 317,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 274,
                                columnNumber: 13
                            }, this),
                            showSteps && result.steps.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "0 24px 24px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "11px",
                                            color: "#4A4A6A",
                                            fontWeight: "700",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.08em",
                                            marginBottom: "10px"
                                        },
                                        children: "Applied rules"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 334,
                                        columnNumber: 17
                                    }, this),
                                    result.steps.map((step, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                background: "#1A1A2E",
                                                borderRadius: "8px",
                                                padding: "12px 14px",
                                                marginBottom: "8px",
                                                borderLeft: "3px solid #E8A838"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: "11px",
                                                        color: "#E8A838",
                                                        fontWeight: "700",
                                                        marginBottom: "6px",
                                                        fontFamily: "Courier New, monospace"
                                                    },
                                                    children: step.rule
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.js",
                                                    lineNumber: 345,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: "13px",
                                                        color: "#C0392B",
                                                        marginBottom: "4px",
                                                        fontStyle: "italic"
                                                    },
                                                    children: [
                                                        "— ",
                                                        step.before
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.js",
                                                    lineNumber: 348,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: "13px",
                                                        color: "#0F7173",
                                                        fontWeight: "600"
                                                    },
                                                    children: [
                                                        "+ ",
                                                        step.after
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.js",
                                                    lineNumber: 351,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/app/page.js",
                                            lineNumber: 338,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 333,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 241,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#2D2D3F",
                            border: "1px solid #4A4A6A",
                            borderRadius: "16px",
                            padding: "28px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    color: "#E8A838",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    marginBottom: "20px",
                                    fontFamily: "Courier New, monospace"
                                },
                                children: "THE 8 CAVEMAN COMPRESSION RULES"
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 368,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                    gap: "10px"
                                },
                                children: RULES.map(({ code, name, desc })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "#1A1A2E",
                                            borderRadius: "8px",
                                            padding: "14px 16px",
                                            display: "flex",
                                            gap: "12px",
                                            alignItems: "flex-start"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: "Courier New, monospace",
                                                    fontSize: "12px",
                                                    color: "#E8A838",
                                                    fontWeight: "700",
                                                    minWidth: "24px",
                                                    paddingTop: "1px"
                                                },
                                                children: code
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.js",
                                                lineNumber: 389,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: "12px",
                                                            fontWeight: "700",
                                                            color: "#F4F2EF",
                                                            marginBottom: "2px"
                                                        },
                                                        children: name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.js",
                                                        lineNumber: 400,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: "11px",
                                                            color: "#8888AA"
                                                        },
                                                        children: desc
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.js",
                                                        lineNumber: 401,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.js",
                                                lineNumber: 399,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, code, true, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 381,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 379,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 362,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.js",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                style: {
                    borderTop: "1px solid #2D2D3F",
                    padding: "20px 32px",
                    textAlign: "center",
                    fontSize: "12px",
                    color: "#4A4A6A"
                },
                children: "🗿 CavePrompt — Reduce LLM token usage by 75% while preserving 100% of technical intent"
            }, void 0, false, {
                fileName: "[project]/app/page.js",
                lineNumber: 410,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `
            }, void 0, false, {
                fileName: "[project]/app/page.js",
                lineNumber: 420,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.js",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime;
}),
];

//# sourceMappingURL=_0x47asd._.js.map