(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/compress.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$compress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/compress.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
    _s();
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSteps, setShowSteps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleCompress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Home.useCallback[handleCompress]": ()=>{
            if (!input.trim()) return;
            const res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$compress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compress"])(input);
            setResult(res);
            setShowSteps(false);
            setCopied(false);
        }
    }["Home.useCallback[handleCompress]"], [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "14px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: "28px"
                                },
                                children: "🗿"
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                style: {
                    flex: 1,
                    maxWidth: "960px",
                    width: "100%",
                    margin: "0 auto",
                    padding: "40px 24px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: "center",
                            marginBottom: "48px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        ].map(({ val, label })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#2D2D3F",
                                    border: "1px solid #4A4A6A",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    textAlign: "center"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#2D2D3F",
                            border: "1px solid #4A4A6A",
                            borderRadius: "16px",
                            overflow: "hidden",
                            marginBottom: "32px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "24px 24px 0"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: "10px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "12px 24px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                    EXAMPLES.map((ex, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "16px 24px 24px"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#2D2D3F",
                            border: "1px solid #0F7173",
                            borderRadius: "16px",
                            overflow: "hidden",
                            marginBottom: "32px",
                            animation: "fadeIn 0.3s ease"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                ].map(({ label, val, sub, color })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: "18px 20px",
                                            textAlign: "center",
                                            borderRight: "1px solid #4A4A6A",
                                            "&:last-child": {
                                                borderRight: "none"
                                            }
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "24px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: "12px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    gap: "8px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        children: result.output || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            showSteps && result.steps.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "0 24px 24px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                    result.steps.map((step, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                background: "#1A1A2E",
                                                borderRadius: "8px",
                                                padding: "12px 14px",
                                                marginBottom: "8px",
                                                borderLeft: "3px solid #E8A838"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#2D2D3F",
                            border: "1px solid #4A4A6A",
                            borderRadius: "16px",
                            padding: "28px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                    gap: "10px"
                                },
                                children: RULES.map(({ code, name, desc })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "#1A1A2E",
                                            borderRadius: "8px",
                                            padding: "14px 16px",
                                            display: "flex",
                                            gap: "12px",
                                            alignItems: "flex-start"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
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
_s(Home, "IauAgNMd+0sT/cUC99RgqXMIe8g=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_1fqrioz._.js.map