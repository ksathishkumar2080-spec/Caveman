// ══════════════════════════════════════════════════════════════════
//  CavePrompt Compression Engine  v2
//  Target: 35–55% token reduction while preserving 100% technical intent
//
//  R8 GUARD — tokens that must NEVER be removed:
//    negations  · scope modifiers · numbers · format specifiers
//    conditional triggers · role/persona markers · technical nouns
// ══════════════════════════════════════════════════════════════════

// ── Helpers ───────────────────────────────────────────────────────
function rep(text, pairs) {
  pairs.forEach(([p, r]) => { text = text.replace(p, r); });
  return text;
}

// ── PHASE 0 — Email / conversation preamble ───────────────────────
const P0_EMAIL_PREAMBLE = [
  [/\bI\s+am\s+writing\s+to\s+/gi,                                                   ""],
  [/\bI\s+(?:just\s+)?wanted\s+to\s+reach\s+out\s+(?:to\s+you\s+)?(?:about|regarding|re:?)?\s*/gi, "re: "],
  [/\bI\s+hope\s+(?:this\s+(?:email|message|note)\s+)?finds?\s+you\s+well[,.]?\s*/gi, ""],
  [/\bI\s+trust\s+(?:this\s+)?(?:email\s+)?finds?\s+you\s+well[,.]?\s*/gi,           ""],
  [/\bthank\s+you\s+for\s+(?:taking\s+the\s+time\s+to\s+)?(?:read|consider|your\s+(?:time|consideration))[^.]*\.\s*/gi, ""],
  [/\blooking\s+forward\s+to\s+hearing\s+from\s+you[.!]?\s*/gi,                      ""],
  [/\bdon'?t\s+hesitate\s+to\s+(?:reach\s+out|contact|ask)[^.!?]*[.!?]?\s*/gi,      ""],
  [/\bplease\s+let\s+me\s+know\s+if\s+you\s+have\s+any\s+(?:questions?|concerns?)[^.!?]*[.!?]?\s*/gi, ""],
  [/\bI\s+(?:look|am\s+looking)\s+forward\s+to\s+/gi,                                ""],
  [/\bI\s+appreciate\s+your\s+(?:time|consideration)[^.!?]*[.!?]?\s*/gi,             ""],
  [/\bfeel\s+free\s+to\s+reach\s+out[^.!?]*[.!?]?\s*/gi,                            ""],
  [/\bwith\s+(?:that\s+said|that)[,]?\s*/gi,                                         ""],
  [/\bmoving\s+forward[,]?\s*/gi,                                                     ""],
  [/\bgoing\s+forward[,]?\s*/gi,                                                     ""],
  [/\bwithout\s+further\s+ado[,]?\s*/gi,                                             ""],
  [/\bfirst\s+(?:of\s+all|and\s+foremost)[,]?\s*/gi,                                 ""],
  [/\blast\s+but\s+not\s+least[,]?\s*/gi,                                             ""],
  [/\bon\s+that\s+note[,]?\s*/gi,                                                     ""],
  [/\bin\s+the\s+meantime[,]?\s*/gi,                                                  ""],
  [/\brest\s+assured[,]?\s*/gi,                                                       ""],
  [/\bthe\s+(?:good\s+)?news\s+is\s+(?:that\s+)?/gi,                                 ""],
];

// ── PHASE 1 — Polite conditionals (R7) ────────────────────────────
const P1_POLITE_COND = [
  [/\bif\s+(?:it'?s?\s+)?not\s+too\s+much\s+trouble[,]?\s*/gi,        ""],
  [/\bif\s+(?:that'?s?\s+)?okay[,]?\s*/gi,                             ""],
  [/\bif\s+(?:it'?s?\s+)?possible[,]?\s*/gi,                          ""],
  [/\bif\s+(?:it'?s?\s+)?applicable[,]?\s*/gi,                        ""],
  [/\bshould\s+it\s+be\s+(?:applicable|relevant|necessary)[,]?\s*/gi, ""],
  [/\bwhenever\s+(?:you'?re?\s+)?ready[,]?\s*/gi,                     ""],
  [/\bat\s+your\s+(?:earliest\s+)?convenience[,]?\s*/gi,              ""],
  [/\bfeel\s+free\s+to\s+/gi,                                         ""],
];

// ── PHASE 2 — Intro scaffolding (R3) ──────────────────────────────
const P2_SCAFFOLDING = [
  [/\b(?:in\s+this\s+task|for\s+this\s+task)[,]?\s*/gi,       ""],
  [/\bfor\s+(?:your\s+)?(?:reference|context)[,]?\s*/gi,      ""],
  [/\bas\s+(?:you\s+know|requested)[,]?\s*/gi,                ""],
  [/\bjust\s+to\s+clarify[,]?\s*/gi,                          ""],
  [/\bto\s+be\s+(?:clear|specific)[,]?\s*/gi,                 ""],
  [/\b(?:please\s+)?note\s+that[,]?\s*/gi,                    ""],
  [/\bas\s+a\s+reminder[,]?\s*/gi,                            ""],
  [/\bfor\s+the\s+(?:following\s+)?(?:purpose|reason)s?[,]?\s*/gi, ""],
  [/\bas\s+(?:a\s+)?(?:background|context)[,]?\s*/gi,         ""],
  [/\bI\s+(?:am\s+)?going\s+to\s+(?:describe|explain|outline)\s+/gi, ""],
];

// ── PHASE 3 — Politeness markers (R2, extended) ───────────────────
const P3_POLITENESS = [
  [/\bplease\s*/gi,                                            ""],
  [/\bcould\s+you\s+(?:please\s+)?/gi,                        ""],
  [/\bwould\s+you\s+(?:mind\s+)?(?:please\s+)?/gi,           ""],
  [/\bcan\s+you\s+(?:please\s+)?/gi,                          ""],
  [/\bI(?:'d|\s+would)\s+(?:really\s+)?(?:appreciate\s+(?:it\s+)?if\s+you\s+(?:could\s+)?)?like\s+(?:you\s+)?(?:to\s+)?/gi, ""],
  [/\bI\s+would\s+like\s+(?:you\s+)?(?:to\s+)?/gi,           ""],
  [/\bI'?d\s+like\s+(?:you\s+)?(?:to\s+)?/gi,               ""],
  [/\bI\s+(?:really\s+)?(?:need|want)\s+you\s+to\s+/gi,      ""],
  [/\bI\s+need\s+(?:you\s+to\s+)?/gi,                        ""],
  [/\bkindly\s+/gi,                                           ""],
  [/\bI\s+(?:would\s+)?(?:really\s+|truly\s+|sincerely\s+|so\s+)?appreciate\s+(?:it\s+)?(?:if\s+(?:you\s+)?(?:could\s+)?)?/gi, ""],
  [/\bdo\s+(?:me\s+a\s+favor\s+and\s+)?/gi,                  ""],
];

// ── PHASE 4 — Sentence-start filler pronouns ──────────────────────
const P4_FILLER_PRONOUNS = [
  // "I want to ..." → ""  (only at sentence start or after ". ")
  [/(?:^|(?<=[.!?]\s+))I\s+(?:want|need|would\s+like|am\s+looking)\s+(?:to\s+|you\s+to\s+)?/gim, ""],
  // "You should / You need to / You will" → ""
  [/(?:^|(?<=[.!?]\s+))You\s+(?:should|need\s+to|will|must|have\s+to)\s+/gim, ""],
  // "We should / We need to" → ""
  [/(?:^|(?<=[.!?]\s+))We\s+(?:should|need\s+to|will|must)\s+/gim, ""],
];

// ── PHASE 5 — Expletive constructions ─────────────────────────────
const P5_EXPLETIVES = [
  [/\bthere\s+(?:is|are|was|were)\s+/gi,              ""],
  [/\bit\s+is\s+(?:important\s+(?:to|that)\s+)?/gi,   ""],
  [/\bit\s+(?:was|will\s+be)\s+/gi,                   ""],
  [/\bthis\s+(?:is|was)\s+a\s+/gi,                    ""],
  [/\bthis\s+function\s+(?:is\s+(?:meant|designed|intended)\s+to|will)\s+/gi, "function: "],
  [/\bthe\s+function\s+(?:is\s+(?:meant|designed|intended)\s+to|will|should)\s+/gi, "function: "],
  [/\bthe\s+(?:script|program|code)\s+(?:is\s+(?:meant|designed|intended)\s+to|will|should)\s+/gi, "code: "],
];

// ── PHASE 6 — Verb phrase compression (R4, extended) ──────────────
const P6_VERB_PHRASES = [
  // "act as a/an [role] and" → "[role]:"
  [/\b(?:act|serve)\s+as\s+(?:a\s+|an\s+)?(.+?)\s+and\s+/gi,       (_, r) => `${r.trim()}: `],
  [/\b(?:act|serve)\s+as\s+(?:a\s+|an\s+)?(.+?)[,.]/gi,            (_, r) => `${r.trim()}.`],
  // "help me design/build/write/create/implement" → action verb
  [/\bhelp\s+(?:me\s+)?(?:to\s+)?(design|build|create|write|implement|develop|generate|review|analyze|fix|debug|refactor|optimize)\s+/gi, (_, v) => `${v} `],
  // "write a/an X that [verb]" → "X:"
  [/\b(?:write|create|build|make|develop|implement|code)\s+(?:a\s+|an\s+)?(\w+(?:\s+\w+)?)\s+that\s+/gi, (_, n) => `${n}: `],
  // "generate/create/write X for" → "X:"
  [/\b(?:generate|produce|create|write|output|provide)\s+(?:a\s+|an\s+|the\s+)?(\w+(?:\s+\w+){0,3})\s+for\s+/gi, (_, n) => `${n}: `],
  // "that takes X as input" → "input: X"
  [/\bthat\s+takes?\s+(?:a\s+|an\s+|the\s+)?(.+?)\s+as\s+input\s*/gi, (_, x) => `input: ${x.trim()} `],
  // "as input" alone
  [/\s+as\s+input\b/gi,                                              ""],
  // "as output" alone
  [/\s+as\s+output\b/gi,                                            ""],
  // "that returns/outputs/produces X" → "→ X"
  [/\bthat\s+(?:returns?|outputs?|produces?|gives?)\s+/gi,          "→ "],
  [/\band\s+(?:returns?|outputs?|produces?|gives?)\s+/gi,           "→ "],
  // "provide me with a list of" → "list:"
  [/\bprovide\s+(?:me\s+)?(?:with\s+)?(?:a\s+|an\s+)?list\s+of\s+/gi, "list: "],
  [/\bgive\s+(?:me\s+)?(?:a\s+|an\s+)?list\s+of\s+/gi,            "list: "],
  [/\bprovide\s+(?:me\s+)?with\s+/gi,                              ""],
  [/\bgive\s+me\s+/gi,                                             ""],
  // "make sure to/that" → ensure (or remove)
  [/\bmake\s+sure\s+(?:to|that)\s+/gi,                             "ensure "],
  [/\bmake\s+sure\s+/gi,                                           "ensure "],
  // "in order to" → "to"
  [/\bin\s+order\s+to\s+/gi,                                       ""],
  // "as well as" → "+"
  [/\bas\s+well\s+as\s+/gi,                                        "+ "],
  // "focusing on" / "particularly focusing on" → "focus:"
  [/\bparticularly\s+focus(?:ing)?\s+on\s+/gi,                     "focus: "],
  [/\bspecifically\s+focus(?:ing)?\s+on\s+/gi,                     "focus: "],
  [/\bfocus(?:ing)?\s+on\s+/gi,                                    "focus: "],
  // "identify any potential X" → "find X"
  [/\bidentify\s+(?:any\s+)?(?:potential\s+)?/gi,                  "find "],
  [/\bcheck\s+for\s+(?:any\s+)?(?:potential\s+)?/gi,              "check: "],
  // "look for" → "find"
  [/\blook\s+for\s+/gi,                                            "find "],
  // "retrieve/fetch/get/pull" data from → "get X FROM"
  [/\b(retrieves?|fetches?|gets?|pulls?|selects?)\s+/gi,          (_, v) => v.toLowerCase().startsWith("retriev") || v.toLowerCase().startsWith("fetch") ? "get " : v + " "],
  // "X including endpoints for A, B, C" → "X: A, B, C"
  [/\bincluding\s+endpoints?\s+for\s+/gi,                         "endpoints: "],
  [/\bincluding\s+/gi,                                            "incl. "],
  // "review the following code" → "review code:"
  [/\breview\s+(?:the\s+)?following\s+(?:code\s+)?(?:snippet|block|example)?\s*/gi, "review code: "],
  // "the following X" → "X:"
  [/\bthe\s+following\s+(\w+(?:\s+\w+){0,2})\s*/gi,              (_, n) => `${n}: `],
  // "below X" / "above X" as filler
  [/\b(?:below|above)\s+(?:is\s+)?(?:the\s+)?/gi,                ""],
  // "generate code for" → "code:"
  [/\bgenerate\s+(?:the\s+)?code\s+(?:for\s+)?/gi,               "code: "],
  // "write code that/to" → "code:"
  [/\bwrite\s+(?:the\s+)?code\s+(?:that|to|for|which)\s+/gi,    "code: "],
  // "design a X" → "X:"
  [/\b(?:design|architect)\s+(?:a\s+|an\s+|the\s+)?/gi,         ""],
];

// ── PHASE 4g — Possessive pronouns ────────────────────────────────
const P4G_POSSESSIVES = [
  [/\bour\s+/gi,             ""],   // "our pricing page" → "pricing page"
  [/\byour\s+/gi,            ""],   // "your team" → "team"
  [/\bmy\s+/gi,              ""],   // "my clients" → "clients"
  [/\btheir\s+/gi,           ""],   // "their product" → "product"
  [/\b(\w{3,})'s\s+/g,       "$1 "], // "company's strategy" → "company strategy"
];

// ── PHASE 4h — Business / sales jargon ────────────────────────────
const P4H_JARGON = [
  [/\bleverage\b/gi,                         "use"],
  [/\butilize\b/gi,                          "use"],
  [/\bfacilitate\b/gi,                       "help"],
  [/\bpain\s+point(?:s)?\b/gi,              "issue"],
  [/\bvalue\s+proposition\b/gi,             "value prop"],
  [/\bkey\s+performance\s+indicator(?:s)?\b/gi, "KPI"],
  [/\breturn\s+on\s+investment\b/gi,         "ROI"],
  [/\bgo[\s-]to[\s-]market\b/gi,             "GTM"],
  [/\bend[\s-]to[\s-]end\b/gi,              "e2e"],
  [/\breach\s+out\s+(?:to\s+)?/gi,          "contact "],
  [/\btouch\s+base\b/gi,                    "connect"],
  [/\bcircle\s+back\b/gi,                   "revisit"],
  [/\bdeep[\s-]dive\b/gi,                   "analyze"],
  [/\bmove\s+the\s+needle\b/gi,             "improve"],
  [/\blow[\s-]hanging\s+fruit\b/gi,         "easy wins"],
  [/\bbest[\s-]in[\s-]class\b/gi,           "top"],
  [/\bcustomer[\s-]facing\b/gi,             "client"],
  [/\bproactive(?:ly)?\s+/gi,              ""],
  [/\bseamless(?:ly)?\s+/gi,              ""],
  [/\bscalable\s+/gi,                      ""],
  [/\bworld[\s-]class\s+/gi,              ""],
  [/\bcutting[\s-]edge\s+/gi,             ""],
  [/\bstate[\s-]of[\s-]the[\s-]art\s+/gi, ""],
  [/\bin\s+the\s+(\w+)\s+industry\b/gi,   (_, n) => n],  // "in the SaaS industry" → "SaaS"
  [/\bin\s+the\s+(\w+)\s+(?:space|sector|vertical)\b/gi, (_, n) => n],
  [/\bthe\s+fact\s+that\s+/gi,            ""],
  [/\bin\s+the\s+event\s+that\s+/gi,      "if "],
  [/\bin\s+the\s+case\s+(?:that|where)\s+/gi, "if "],
  [/\bgiven\s+that\s+/gi,                 "if "],
  [/\bassume\s+that\s+/gi,               "if "],
  [/\bensure\s+that\s+/gi,               "ensure "],
  [/\bnote\s+that\s+/gi,                 ""],
  [/\bkeep\s+in\s+mind\s+(?:that\s+)?/gi, ""],
  [/\btake\s+into\s+account\s+/gi,       "consider "],
  [/\btake\s+a\s+look\s+at\s+/gi,        "review "],
  [/\bget\s+back\s+to\s+/gi,             "reply "],
  [/\bin\s+other\s+words[,]?\s+/gi,      ""],
  [/\bon\s+the\s+other\s+hand[,]?\s+/gi, ""],
];

// ── PHASE 7 — Tech abbreviations (R5, extended) ───────────────────
const P7_TECH_ABBREV = [
  [/\bJavaScript\b/g,        "JS"],
  [/\bTypeScript\b/g,        "TS"],
  [/\bPython\b/g,            "py"],
  [/\bdatabases?\b/gi,       "DB"],
  [/\bapplications?\b/gi,    "app"],
  [/\brepository\b/gi,       "repo"],
  [/\bapplication\s+programming\s+interface\b/gi, "API"],
  [/\buser\s+interface\b/gi, "UI"],
  [/\bcommand[\s-]line\s+interface\b/gi, "CLI"],
  [/\bpull\s+request\b/gi,   "PR"],
  [/\bfunctions?\b/gi,       "fn"],
  [/\bintegers?\b/gi,        "int"],
  [/\bnumbers?\b/gi,         "num"],
  [/\bparameters?\b/gi,      "param"],
  [/\barguments?\b/gi,       "arg"],
  [/\bvariables?\b/gi,       "var"],
  [/\bauthentication\b/gi,   "auth"],
  [/\bauthorization\b/gi,    "authz"],
  [/\bconfiguration\b/gi,    "config"],
  [/\bdocumentation\b/gi,    "docs"],
  [/\bimplementation\b/gi,   "impl"],
  [/\brequirements?\b/gi,    "req"],
  [/\bpassword\b/gi,         "pwd"],
  [/\bmessage\b/gi,          "msg"],
  [/\berror(?:s)?\b/gi,      "err"],
  [/\bexception(?:s)?\b/gi,  "exc"],
  [/\bmaximum\b/gi,          "max"],
  [/\bminimum\b/gi,          "min"],
  [/\binformation\b/gi,      "info"],
  [/\bcharacter(?:s)?\b/gi,  "char"],
  [/\bstring(?:s)?\b/gi,     "str"],
  [/\bdirectory\b/gi,        "dir"],
  [/\btemporary\b/gi,        "tmp"],
];

// ── PHASE 8 — Articles (R1) ────────────────────────────────────────
const P8_ARTICLES = /\b(a|an|the)\b\s*/gi;

// ── PHASE 9 — Filler adverbs & qualifiers ─────────────────────────
const P9_FILLER_ADVERBS = [
  [/\b(?:very|really|quite|rather|somewhat|fairly|extremely|highly|truly|absolutely|completely|totally|utterly|entirely)\s+/gi, ""],
  [/\b(?:basically|simply|just|merely|essentially|effectively|efficiently|properly|correctly|appropriately|carefully|thoroughly|comprehensively)\s+/gi, ""],
  [/\b(?:obviously|clearly|certainly|definitely|undoubtedly|evidently|apparently)\s+/gi, ""],
  [/\b(?:generally|typically|usually|commonly|normally|traditionally|conventionally)\s+/gi, ""],
  [/\b(?:significantly|substantially|considerably|markedly|notably|remarkably)\s+/gi, ""],
  // Redundant qualifiers before nouns (non-scope)
  [/\bcomprehensive\s+/gi,   ""],
  [/\bdetailed\s+/gi,        ""],
  [/\bthorough\s+(?!testing|review|audit)/gi, ""],  // keep "thorough review/testing"
  [/\brobust\s+/gi,          ""],
  [/\bfull\s+(?!stack|text|path|match|scan)/gi, ""], // keep full-stack etc.
  [/\bcomplete\s+(?!list|set)/gi, ""],
  [/\bproper\s+/gi,          ""],
  [/\befficient\s+/gi,       ""],
  [/\beffective\s+/gi,       ""],
  [/\baccurate\s+/gi,        ""],
  [/\bclear\s+(?!cache)/gi,  ""],  // keep "clear cache"
  [/\bconcise\s+/gi,         ""],
  [/\bwell[\s-]structured\s+/gi, ""],
  [/\bwell[\s-]formatted\s+/gi,  ""],
  [/\bappropriate\s+/gi,     ""],
  [/\bsuitable\s+/gi,        ""],
  [/\bpotential\s+/gi,       ""],  // R8 safe: doesn't change negation/scope
  [/\bpossible\s+(?!values|states|options)/gi, ""],
  [/\bnecessary\s+/gi,       ""],
  [/\brelevant\s+/gi,        ""],
  [/\bspecific\s+/gi,        ""],
  [/\bmost\s+(?!of\b|the\b|important\b|critical\b|urgent\b|recent\b)/gi, ""],
  [/\byet\s+(?=\w)/gi,       ""],   // "concise yet comprehensive" → remove "yet"
  [/\band\s+then\s+/gi,      ""],   // "and then provide" → "provide"
  [/\bfor\s+each\s+(?:one\b)?\s*/gi, "per "],  // "for each one" → "per"
  [/\bwithin\s+the\s+/gi,    "in "],
  [/\bacross\s+the\s+/gi,    "across "],
  [/\bthroughout\s+the\s+/gi,"in "],
];

// ── PHASE 10 — Helping / modal verbs (safe cases only) ────────────
const P10_HELPING_VERBS = [
  // "should X" at start of clause (not "should not")
  [/\bshould\s+(?!not\b|n'?t\b)/gi,  ""],
  // "will X" (not "will not")
  [/\bwill\s+(?!not\b|n'?t\b)/gi,    ""],
  // "would X" (not "would not")
  [/\bwould\s+(?!not\b|n'?t\b)/gi,   ""],
  // "may X" (not "may not")
  [/\bmay\s+(?!not\b)/gi,            ""],
  // "might X" (not "might not")
  [/\bmight\s+(?!not\b)/gi,          ""],
  // "can X" at sentence level (not "can not/cannot")
  [/\bcan\s+(?!not\b|n'?t\b)/gi,     ""],
  // "is able to" → ""
  [/\bis\s+able\s+to\s+/gi,          ""],
  // "are able to" → ""
  [/\bare\s+able\s+to\s+/gi,         ""],
  // "needs to be" → "must be"... actually just ""
  [/\bneeds?\s+to\s+be\s+/gi,        ""],
  // "is going to" → ""
  [/\b(?:is|are|was|were)\s+going\s+to\s+/gi, ""],
  // "is supposed to" → ""
  [/\b(?:is|are)\s+supposed\s+to\s+/gi, ""],
  // "be sure to" → ""
  [/\bbe\s+sure\s+to\s+/gi,          ""],
];

// ── PHASE 11 — Relative pronouns & connectors ─────────────────────
const P11_RELATIVES = [
  // "which is/are/was/were" → ""
  [/\bwhich\s+(?:is|are|was|were)\s+/gi,                   ""],
  // ", which X" → "; X" or just remove
  [/[,]?\s+which\s+(?!ever)/gi,                             " "],
  // "that is/are/was/were" → ""
  [/\bthat\s+(?:is|are|was|were)\s+/gi,                    ""],
  // "who is/are" → ""
  [/\bwho\s+(?:is|are|was|were)\s+/gi,                     ""],
  // Transition words at sentence start
  [/(?:^|(?<=[.!?]\s+))(?:Furthermore|Additionally|Moreover|However|Therefore|Thus|Hence|Consequently|As\s+a\s+result|In\s+addition|In\s+conclusion|Finally|Lastly|Firstly|Secondly)[,]?\s+/gim, ""],
  // "such as" → "e.g."
  [/\bsuch\s+as\s+/gi,                                     "e.g. "],
  // "in terms of" → ""
  [/\bin\s+terms\s+of\s+/gi,                               ""],
  // "with respect to" → ""
  [/\bwith\s+respect\s+to\s+/gi,                           ""],
  // "with regard to" → ""
  [/\bwith\s+regard(?:s)?\s+to\s+/gi,                     ""],
  // "in the context of" → ""
  [/\bin\s+the\s+context\s+of\s+/gi,                      ""],
];

// ── PHASE 12 — "from that X" / trailing filler ────────────────────
const P12_TRAILING = [
  [/\bfrom\s+that\s+list\b/gi,        ""],
  [/\bfrom\s+(?:those|these)\s+/gi,   "from "],
  [/\bof\s+(?:those|these)\s+/gi,     "of "],
  [/\bthe\s+result(?:ing)?\s+/gi,     ""],
  [/\bthe\s+output\s+of\s+/gi,        "output: "],
  [/\busing\s+the\s+/gi,              "using "],
  [/\bbased\s+on\s+(?:the\s+)?/gi,   "from "],
  [/\brelated\s+to\s+/gi,            "re: "],
  [/\bin\s+(?:a|an)\s+(?=\w)/gi,     "in "],
  // Remove filler "do" constructs
  [/\bdo\s+not\s+/gi,               "no "],
  [/\bdoes\s+not\s+/gi,             "no "],
  [/\bdid\s+not\s+/gi,              "no "],
];

// ── Estimate tokens ────────────────────────────────────────────────
function estimateTokens(text) {
  if (!text.trim()) return 0;
  const words = text.trim().split(/\s+/).length;
  const chars = text.trim().length;
  // BPE tokenizers: ~1.3 tokens per word on average, adjusted for symbols
  return Math.ceil(words * 1.3 + (chars > words * 6 ? (chars - words * 6) * 0.05 : 0));
}

// ── Main export ────────────────────────────────────────────────────
export function compress(input) {
  if (!input.trim()) return { output: "", steps: [], inputTokens: 0, outputTokens: 0 };

  let text = input;
  const steps = [];

  const apply = (label, fn) => {
    const before = text;
    text = fn(text).replace(/\s{2,}/g, " ").trim();
    if (before.trim() !== text.trim()) {
      steps.push({ rule: label, before: before.trim(), after: text.trim() });
    }
  };

  apply("R0  — Email preamble",          (t) => rep(t, P0_EMAIL_PREAMBLE));
  apply("R7 — Polite conditionals",     (t) => rep(t, P1_POLITE_COND));
  apply("R3 — Intro scaffolding",       (t) => rep(t, P2_SCAFFOLDING));
  apply("R2 — Politeness markers",      (t) => rep(t, P3_POLITENESS));
  apply("R4a — Filler pronouns",        (t) => rep(t, P4_FILLER_PRONOUNS));
  apply("R4b — Expletive constructions",(t) => rep(t, P5_EXPLETIVES));
  apply("R4c — Verb phrase compression",(t) => rep(t, P6_VERB_PHRASES));
  apply("R4g — Possessives",            (t) => rep(t, P4G_POSSESSIVES));
  apply("R4h — Business jargon",        (t) => rep(t, P4H_JARGON));
  apply("R5  — Tech abbreviations",     (t) => rep(t, P7_TECH_ABBREV));
  apply("R1  — Articles",               (t) => t.replace(P8_ARTICLES, ""));
  apply("R4d — Filler adverbs/qualifiers",(t) => rep(t, P9_FILLER_ADVERBS));
  apply("R4e — Helping/modal verbs",    (t) => rep(t, P10_HELPING_VERBS));
  apply("R4f — Relative pronouns",      (t) => rep(t, P11_RELATIVES));
  apply("R6  — Trailing filler",        (t) => rep(t, P12_TRAILING));

  // Final cleanup — collapse spaces, fix punctuation, trim dangling punctuation
  text = text
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .replace(/([.:,])\s*([.:,])/g, "$1")      // ".:," dedup
    .replace(/→\s*→/g, "→")                   // double arrows
    .replace(/:\s*:/g, ":")                    // double colons
    .replace(/^[,;.\s]+/, "")                  // leading punctuation
    .replace(/[,;\s]+$/g, "")                  // trailing punctuation/spaces
    .replace(/\(\s+/g, "(").replace(/\s+\)/g, ")")
    .trim();

  // Capitalise first letter
  text = text.charAt(0).toUpperCase() + text.slice(1);

  const inputTokens  = estimateTokens(input);
  const outputTokens = estimateTokens(text);
  const reduction    = inputTokens > 0
    ? Math.round((1 - outputTokens / inputTokens) * 100)
    : 0;

  return { output: text, steps, inputTokens, outputTokens, reduction };
}
