// R1: Drop articles
const articles = /\b(a|an|the)\b\s*/gi;

// R2: Drop politeness markers
const politeness = /\b(please|could you|would you|can you|i'd like(?: you)?(?: to)?|i would like(?: you)?(?: to)?|i want you to|feel free to|kindly|i need you to|i'd appreciate(?: it)?(?: if)?)\b\s*/gi;

// R3: Drop intro scaffolding
const scaffolding = /\b(in this task[,]?|for context[,]?|as requested[,]?|as you know[,]?|for your reference[,]?|just to clarify[,]?|to be clear[,]?|note that[,]?|please note[,]?|as a reminder[,]?)\s*/gi;

// R4: Compress verbose verb phrases
const verbPhrases = [
  [/provide me with a list of/gi, "list"],
  [/provide me with/gi, "provide"],
  [/give me a list of/gi, "list"],
  [/give me/gi, "give"],
  [/generate code for/gi, "code:"],
  [/write code (that|to|for|which)/gi, "code:"],
  [/write a (function|method|class|script) (that|to|for|which)/gi, (_, type) => `${type}:`],
  [/create a (function|method|class|script) (that|to|for|which)/gi, (_, type) => `${type}:`],
  [/help me (design|build|create|write|implement)/gi, (_, v) => v],
  [/make sure to/gi, ""],
  [/make sure/gi, "ensure"],
  [/in order to/gi, "to"],
  [/as well as/gi, "and"],
  [/that takes (a|an|the)?\s*/gi, "input:"],
  [/that returns/gi, "return"],
  [/and returns/gi, "return"],
];

// R5: Abbreviate known tech (conservative — only unambiguous)
const techAbbrev = [
  [/\bJavaScript\b/g, "JS"],
  [/\bTypeScript\b/g, "TS"],
  [/\bdatabase\b/gi, "DB"],
  [/\bapplication\b/gi, "app"],
  [/\brepository\b/gi, "repo"],
  [/\bapplication programming interface\b/gi, "API"],
  [/\buser interface\b/gi, "UI"],
  [/\bcommand line interface\b/gi, "CLI"],
  [/\bpull request\b/gi, "PR"],
];

// R7: Flatten polite conditionals
const politeConditionals = [
  [/if (it'?s? )?not too much trouble[,]?\s*/gi, ""],
  [/if (that'?s? )?okay[,]?\s*/gi, ""],
  [/if (it'?s? )?possible[,]?\s*/gi, ""],
  [/if (it'?s? )?applicable[,]?\s*/gi, ""],
  [/should it be (applicable|relevant|necessary)[,]?\s*/gi, ""],
  [/whenever (you'?re? )?ready[,]?\s*/gi, ""],
  [/at your (earliest )?convenience[,]?\s*/gi, ""],
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

export function compress(input) {
  if (!input.trim()) return { output: "", steps: [], inputTokens: 0, outputTokens: 0 };

  let text = input;
  const steps = [];

  const apply = (label, fn) => {
    const before = text;
    text = fn(text);
    text = text.replace(/\s{2,}/g, " ").trim();
    if (before.trim() !== text.trim()) {
      steps.push({ rule: label, before: before.trim(), after: text.trim() });
    }
  };

  apply("R7 — Flatten polite conditionals", (t) => {
    politeConditionals.forEach(([p, r]) => { t = applyRule(t, p, r); });
    return t;
  });

  apply("R3 — Drop intro scaffolding", (t) => t.replace(scaffolding, ""));

  apply("R2 — Drop politeness markers", (t) => t.replace(politeness, ""));

  apply("R4 — Compress verb phrases", (t) => {
    verbPhrases.forEach(([p, r]) => { t = applyRule(t, p, r); });
    return t;
  });

  apply("R5 — Abbreviate known tech", (t) => {
    techAbbrev.forEach(([p, r]) => { t = applyRule(t, p, r); });
    return t;
  });

  apply("R1 — Drop articles", (t) => t.replace(articles, ""));

  text = text
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();

  const inputTokens = estimateTokens(input);
  const outputTokens = estimateTokens(text);
  const reduction = inputTokens > 0 ? Math.round((1 - outputTokens / inputTokens) * 100) : 0;

  return { output: text, steps, inputTokens, outputTokens, reduction };
}
