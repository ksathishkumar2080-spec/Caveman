// ══════════════════════════════════════════════════════════════════
//  PCA Compression Engine v3.0
//  Based on Prompt Compression Architecture (PCA) v1.0
//
//  Layer 1: System Brain      — "Act as X" → BRAIN: X
//  Layer 2: Variable Inputs   — Natural language → Key: Value
//  Layer 3: Retrieval Facts   — Context → bullet facts
//  Layer 4: Context Pyramid   — Strip superfluous scaffolding
//  Layer 5: Instruction IDs   — Methodology → codes
//  Layer 6: Example Compress  — Examples → pattern notation
//  Layer 7: Output Constraints— Format / word limits
//  Layer 8: Multi-Step        — Compound tasks → STAGE_N
//
//  Residual pass (Layers R1-R12):
//    Word-level filler removal on text not consumed by PCA layers
// ══════════════════════════════════════════════════════════════════

// ── Token estimator ───────────────────────────────────────────────
function estimateTokens(text) {
  if (!text.trim()) return 0;
  const words = text.trim().split(/\s+/).length;
  const chars = text.trim().length;
  return Math.ceil(words * 1.3 + (chars > words * 6 ? (chars - words * 6) * 0.05 : 0));
}

// ── Helpers ───────────────────────────────────────────────────────
function rep(text, pairs) {
  pairs.forEach(([p, r]) => { text = text.replace(p, r); });
  return text;
}

function collapse(text) {
  return text.replace(/\s{2,}/g, ' ').trim();
}

// ══════════════════════════════════════════════════════════════════
//  LAYER 1 — System Brain
// ══════════════════════════════════════════════════════════════════
function extractBrain(text) {
  const patterns = [
    // "Act / serve / behave as a/an [role]..."
    /\b(?:act|serve|behave|respond|pretend|imagine you are)\s+as\s+(?:an?\s+)?([^.!?\n]+?)(?=\s*[.!?]|\s+and\s+(?:you|I|help|write|create)|\s*,\s*you\s+(?:understand|know|write|have|are)|$)/gi,
    // "You are a/an [role]"
    /^you\s+are\s+(?:an?\s+)?([^.!?\n]+?)(?=\s*[.!?]|$)/gim,
    // "As a/an [role], ..."
    /^[Aa]s\s+an?\s+([^,.\n]+?)[,.\s]+(?=you\s+(?:understand|write|know|have|are|help)|please|i\s+(?:need|want)|write|create)/gm,
    // "Your role is to be..."
    /\byour\s+role\s+is\s+(?:to\s+(?:be\s+|act\s+as\s+))?(?:an?\s+)?([^.!?\n]+?)(?=\s*[.!?]|$)/gi,
  ];

  let brain = null;
  let remaining = text;

  for (const re of patterns) {
    re.lastIndex = 0;
    const m = re.exec(remaining);
    if (m) {
      brain = m[1].trim()
        .replace(/\bexpert\s+/gi, '')
        .replace(/\bexperienced\s+/gi, '')
        .replace(/\bskilled\s+/gi, '')
        .replace(/\bsenior\s+/gi, 'Sr ')
        .replace(/[.,\s]+$/, '');
      remaining = collapse(remaining.replace(m[0], ' '));
      break;
    }
  }

  if (brain) {
    // ── Compact relative clauses inside the brain string itself ──────
    // "SDR who specializes in pharma" → "SDR | Pharma"
    brain = brain
      .replace(/\bwho\s+speciali[sz]es?\s+in\s+([^,.|]+?)\s*$/gi, (_, t) => ' | ' + t.trim())
      .replace(/\bwho\s+(?:understands?|knows?|focuses?\s+on)\s+([^,.|]+?)\s*$/gi, (_, t) => ' | ' + t.trim())
      .replace(/,?\s*with\s+(?:deep\s+)?expertise\s+in\s+([^,.|]+?)\s*$/gi, (_, t) => ' | ' + t.trim())
      .replace(/\band\s+(?:writes?|creates?)\s+[^|]+/gi, '')
      .replace(/\band\s+uses?\s+[^|]+(?:selling|methodology)\b/gi, '') // strip "and uses challenger selling"
      .replace(/[.,\s]+$/, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    // Consume follow-up "You understand X. You write Y." attribute lines
    const attrRe = /\byou\s+(?:understand|know|specialize\s+in|focus\s+on|have\s+expertise\s+in|are\s+familiar\s+with)\s+([^.!?\n]+?)\s*[.!?]/gi;
    const attrs = [];
    remaining = remaining.replace(attrRe, (_, a) => { attrs.push(a.trim()); return ' '; });
    remaining = collapse(remaining);
    if (attrs.length) brain += ' | ' + attrs.map(a => a.replace(/^the\s+/i, '')).join(' | ');

    // Also capture remaining "who specializes in X" in the rest of text
    const specRe = /\bwho\s+speciali[sz]es?\s+in\s+([^,.\n]+)/gi;
    remaining = remaining.replace(specRe, (_, a) => { brain += ' | ' + a.trim(); return ' '; });
    remaining = collapse(remaining);
  }

  return { brain, remaining };
}

// ══════════════════════════════════════════════════════════════════
//  LAYER 2 — Variable Inputs
// ══════════════════════════════════════════════════════════════════
function extractVariables(text) {
  const vars = {};
  let remaining = text;

  // ── Task extraction ────────────────────────────────────────────
  // "write/draft/create/compose a/an [output-type]"
  // Requires a SPACE before the output-type word (prevents "JavaScript" matching via "script" suffix)
  const taskRe = /\b(?:write|draft|create|compose|generate|produce|build)\s+(?:an?\s+)?([a-z]+(?:\s+[a-z]+){0,4}\s+(?:email|message|script|deck|summary|proposal|sequence|template|outreach|copy|post|pitch|follow[\s-]?up|note))\b/gi;
  const taskM = taskRe.exec(remaining);
  if (taskM) {
    vars.task = taskM[1].trim();
    remaining = collapse(remaining.replace(taskM[0], ' '));
  }

  // ── Persona + Company: "to the Director of Analytics at BioNTech" ──
  const perCoRe = /\bto\s+(?:the\s+)?([A-Z][a-zA-Z\s]+?)\s+at\s+([A-Z][a-zA-Z0-9\s.&,'-]+?)(?=[,.\s\n]|$)/g;
  const perCoM = perCoRe.exec(remaining);
  if (perCoM) {
    vars.persona = perCoM[1].trim().replace(/\s+of\s+/g, ' ');
    vars.company = perCoM[2].trim().replace(/[.,\s]+$/, '');
    remaining = collapse(remaining.replace(perCoM[0], ' '));
  }

  // ── Persona only: "for a potential enterprise client" ─────────
  if (!vars.persona) {
    const forRe = /\bfor\s+(?:an?\s+)?(?:potential\s+)?([a-z]+(?:\s+[a-z]+){0,4}?(?:client|customer|prospect|decision[\s-]maker|buyer|company|business))\b/gi;
    const forM = forRe.exec(remaining);
    if (forM) {
      vars.persona = forM[1].trim();
      remaining = collapse(remaining.replace(forM[0], ' '));
    }
  }

  // ── Offer: "We help X do Y" / "Our product enables X" ─────────
  const offerRe = /\bwe\s+(?:help|enable|allow|provide|offer|give|empower|build)\s+([^.!?\n]+?)(?=\s*[.!?]|$)/gi;
  const offerM = offerRe.exec(remaining);
  if (offerM) {
    let offer = offerM[1].trim()
      .replace(/\bcommercial\s+/gi, '')
      .replace(/\b(?:teams?|companies|businesses)\s+to\s+/gi, ': ')
      .replace(/\bmore\s+(?:quickly|efficiently|accurately|effectively)\b/gi, 'speed+')
      .replace(/\bfaster\b/gi, 'speed+')
      .replace(/\bmore\s+accurately\b/gi, 'accuracy+')
      .replace(/\bimprove\s+/gi, '+');
    vars.offer = collapse(offer);
    remaining = collapse(remaining.replace(offerM[0], ' '));
  }
  if (!vars.offer) {
    const ourRe = /\bour\s+(?:product|solution|platform|tool|software|service)\s+(?:helps?|enables?|allows?|lets?)\s+([^.!?\n]+?)(?=\s*[.!?]|$)/gi;
    const ourM = ourRe.exec(remaining);
    if (ourM) {
      vars.offer = collapse(ourM[1].trim());
      remaining = collapse(remaining.replace(ourM[0], ' '));
    }
  }

  // ── Industry ────────────────────────────────────────────────────
  const indRe = /\bin\s+the\s+([\w\s]+?)\s+(?:industry|sector|space|vertical)\b/gi;
  const indM = indRe.exec(remaining);
  if (indM) {
    vars.industry = indM[1].trim();
    remaining = collapse(remaining.replace(indM[0], ' '));
  }
  if (!vars.industry) {
    const indKw = /\b(pharma(?:ceutical)?s?|healthcare|fintech|SaaS|B2B|B2C|enterprise\s+software|manufacturing|retail|insurance|legal|real\s+estate|biotech|medtech|edtech|proptech|logistics)\b/gi;
    const kwM = indKw.exec(remaining);
    if (kwM) {
      vars.industry = kwM[1].trim();
    }
  }

  // ── Signals: "who recently visited / announced / launched" ─────
  // Bounded to ~6 words to prevent swallowing entire sentences
  const SIG_BOUND = /(?=[,.?!]|\s+(?:and|but|I|we|you|they|this|that)\b|$)/;
  const signals = [];
  const sigRe1 = new RegExp(
    String.raw`\bwho\s+(?:recently\s+)?([a-z]+(?:ed|ing)(?:\s+\w+){0,5}?)` + SIG_BOUND.source, 'gi'
  );
  remaining = remaining.replace(sigRe1, (m, action) => { signals.push(action.trim()); return ' '; });

  const sigRe2 = new RegExp(
    String.raw`\bthey\s+(?:recently\s+)?(?:have\s+)?([a-z]+(?:ed|ing)(?:\s+\w+){0,5}?)` + SIG_BOUND.source, 'gi'
  );
  remaining = remaining.replace(sigRe2, (m, action) => { signals.push(action.trim()); return ' '; });

  const sigRe3 = new RegExp(
    String.raw`\b(?:the\s+)?(?:company|prospect|client)\s+(?:recently\s+)?([a-z]+(?:ed|ing)(?:\s+\w+){0,5}?)` + SIG_BOUND.source, 'gi'
  );
  remaining = remaining.replace(sigRe3, (m, action) => { signals.push(action.trim()); return ' '; });

  if (signals.length) vars.signals = signals;
  remaining = collapse(remaining);

  return { vars, remaining };
}

// ══════════════════════════════════════════════════════════════════
//  LAYER 3 — Retrieval / Context Compression
// ══════════════════════════════════════════════════════════════════
function compressContext(text) {
  let remaining = text;

  // Long prose sentences → strip "background" filler introductions
  remaining = remaining
    .replace(/\b(?:by way of|as\s+(?:a\s+)?background|to\s+give\s+you\s+context)[,:]?\s*/gi, '')
    .replace(/\b(?:as\s+you\s+may\s+(?:know|recall|remember))[,:]?\s*/gi, '')
    .replace(/\bfor\s+(?:your\s+)?(?:reference|context|background)[,:]?\s*/gi, '')
    .replace(/\bsome\s+(?:additional\s+)?(?:context|background)[,:]?\s*/gi, '');

  return collapse(remaining);
}

// ══════════════════════════════════════════════════════════════════
//  LAYER 5 — Instruction IDs (Method / Playbook / Rules)
// ══════════════════════════════════════════════════════════════════
// Optional imperative prefix: "Use challenger selling" → consumes "Use" too
const M_PRE = String.raw`(?:use|apply|employ|follow|utilize)\s+`;
const METHOD_MAP = [
  [new RegExp(String.raw`\b(?:${M_PRE})?challenger\s+(?:sale|selling|approach|method(?:ology)?)`, 'gi'), 'Challenger'],
  [new RegExp(String.raw`\b(?:${M_PRE})?consultative\s+(?:sale|selling|approach)`, 'gi'),               'Consultative'],
  [new RegExp(String.raw`\b(?:${M_PRE})?spin\s+(?:sale|selling)`, 'gi'),                               'SPIN'],
  [new RegExp(String.raw`\b(?:${M_PRE})?value[\s-](?:based\s+)?selling`, 'gi'),                        'Value-Sell'],
  [new RegExp(String.raw`\b(?:${M_PRE})?solution[\s-](?:based\s+)?selling`, 'gi'),                     'Solution-Sell'],
  [/\bBANT\b/g,                                                                                          'BANT'],
  [/\bMEDDIC\b/g,                                                                                        'MEDDIC'],
  [/\bpersonali[sz]e?\s*(?:deeply|the\s+message|it)?\b/gi,                                             'Personalized'],
  [/\bbusiness\s+outcome[\s-]?(?:focused|driven|focus)?\b/gi,                                          'Outcome'],
  [/\bexecutive[\s-](?:friendly|level|tone)\b/gi,                                                      'Exec-Tone'],
  [/\bconversational\s+tone\b/gi,                                                                       'Conv-Tone'],
  [/\bempathy[\s-](?:based|driven|led)?\b/gi,                                                          'Empathy'],
  [/\bdata[\s-]driven\b/gi,                                                                             'Data-Led'],
];

const RULE_MAP = [
  [/\bone\s+(?:clear\s+)?(?:CTA|call[\s-]to[\s-]action)\b/gi,       'CTA:1'],
  [/\bno\s+(?:jargon|buzzwords?|fluff(?:y\s+language)?)\b/gi,       'NoJargon'],
  [/\bavoid\s+(?:jargon|buzzwords?|fluff\w*)\b/gi,                   'NoJargon'],
  [/\bdo\s+not\s+(?:use|say|mention)\s+(?:the\s+word\s+)?hope\b/gi, 'NoHope'],
  [/\bfirst[\s-]person\b/gi,                                        '1stP'],
  [/\bthird[\s-]person\b/gi,                                        '3rdP'],
];

function extractMethods(text) {
  const methods = [];
  const rules = [];
  let remaining = text;

  for (const [re, label] of METHOD_MAP) {
    re.lastIndex = 0;
    if (re.test(remaining)) {
      methods.push(label);
      re.lastIndex = 0;
      remaining = remaining.replace(re, ' ');
    }
    re.lastIndex = 0;
  }

  for (const [re, label] of RULE_MAP) {
    re.lastIndex = 0;
    if (re.test(remaining)) {
      if (!rules.includes(label)) rules.push(label);
      re.lastIndex = 0;
      remaining = remaining.replace(re, ' ');
    }
    re.lastIndex = 0;
  }

  remaining = collapse(remaining);
  return { methods, rules, remaining };
}

// ══════════════════════════════════════════════════════════════════
//  LAYER 6 — Example Compression
// ══════════════════════════════════════════════════════════════════
function compressExamples(text) {
  let remaining = text;
  let exampleCount = 0;

  // "Here's an example: ..." or "For example, ..."  (long texts only)
  remaining = remaining.replace(
    /\b(?:here(?:'s|\s+is)\s+(?:an?\s+)?example|for\s+example)[:\s]+[^\n]{50,}/gi,
    () => { exampleCount++; return 'Pattern:[see-above]'; }
  );

  // Numbered "Example 1: ..."
  remaining = remaining.replace(
    /^(?:Example|Sample)\s*\d+\s*:\s*.{30,}/gim,
    () => { exampleCount++; return ''; }
  );

  remaining = collapse(remaining);
  return { exampleCount, remaining };
}

// ══════════════════════════════════════════════════════════════════
//  LAYER 7 — Output Constraints
// ══════════════════════════════════════════════════════════════════
// Optional imperative prefix so "Include a subject line" → consumes "Include a"
const O_PRE = String.raw`(?:(?:include|add|write|create|provide|generate)\s+(?:a[n]?\s+)?)?`;
const OUTPUT_MAP = [
  [new RegExp(O_PRE + String.raw`subject\s+line`, 'gi'),                                        'Subject'],
  [/\bcold\s+outreach\s+email\b/gi,                                                              'Email'],
  [/\bfollow[\s-]?up\s+email\b/gi,                                                               'Follow-Up'],
  [new RegExp(O_PRE + String.raw`linkedin\s+(?:message|connection\s+request|DM|note|post)?`, 'gi'), 'LinkedIn'],
  [new RegExp(O_PRE + String.raw`call\s+(?:script|opener|opening|intro)`, 'gi'),                'Call-Script'],
  [new RegExp(O_PRE + String.raw`voicemail(?:\s+script)?`, 'gi'),                               'Voicemail'],
  [/\bsales\s+deck\b/gi,                                                                         'Deck'],
  [new RegExp(O_PRE + String.raw`executive\s+summary`, 'gi'),                                   'Exec-Summary'],
  [/\btweet(?:\s+thread)?\b/gi,                                                                  'Tweet'],
  [/\bprospecting\s+sequence\b/gi,                                                               'Sequence'],
  [/\bemail\b(?!\s+to\b)/gi,                                                                     'Email'],
];

// Most-specific patterns first — prevents "under N words" racing ahead of "keep it under N words"
const WORD_LIMIT_RES = [
  /\bkeep\s+it\s+(?:to\s+)?(?:under\s+)?(\d+)\s+words?\b/gi,
  /\b(\d+)[\s-]word\s+(?:limit|max(?:imum)?|cap|email|message|summary)\b/gi,
  /\bmaximum\s+(?:of\s+)?(\d+)\s+words?\b/gi,
  /\bmax(?:imum)?\s+(\d+)\s+(?:words?|w)\b/gi,
  /\bno\s+more\s+than\s+(\d+)\s+words?\b/gi,
  /\bunder\s+(\d+)\s+words?\b/gi,
];

function extractOutputConstraints(text) {
  const outputs = new Set();
  let maxWords = null;
  let remaining = text;

  for (const [re, label] of OUTPUT_MAP) {
    re.lastIndex = 0;
    if (re.test(remaining)) {
      outputs.add(label);
      re.lastIndex = 0;
      remaining = remaining.replace(re, ' ');
    }
    re.lastIndex = 0;
  }

  for (const re of WORD_LIMIT_RES) {
    re.lastIndex = 0;
    const m = re.exec(remaining);
    if (m) {
      maxWords = parseInt(m[1], 10);
      remaining = remaining.replace(m[0], ' ');
    }
    re.lastIndex = 0;
  }

  // After outputs are extracted, remove generic "include / write / add" verbs that now dangle
  if (outputs.size > 0) {
    remaining = remaining
      .replace(/\b(?:include|write|create|add|generate|produce)\s+(?:an?\s+)?(?:also\s+)?/gi, '')
      .replace(/\bwith\s+(?:a\s+)?/gi, '');
  }

  remaining = collapse(remaining);
  return { outputs: [...outputs], maxWords, remaining };
}

// ── Email/message inference from task ─────────────────────────────
// If the task mentions "email" or "message" but it wasn't caught by OUTPUT_MAP
// (because it was consumed by task extraction), add it back.
function inferOutputFromTask(task, outputs) {
  if (!task) return outputs;
  const has = (kw) => new RegExp(kw, 'i').test(task);
  const result = [...outputs];
  if (has('email|outreach') && !result.includes('Email'))           result.unshift('Email');
  if (has('follow.?up') && !result.includes('Follow-Up'))           result.unshift('Follow-Up');
  if (has('linkedin') && !result.includes('LinkedIn'))              result.push('LinkedIn');
  if (has('call.script|call.opener') && !result.includes('Call-Script')) result.push('Call-Script');
  if (has('deck|presentation') && !result.includes('Deck'))         result.push('Deck');
  return result;
}

// ══════════════════════════════════════════════════════════════════
//  LAYER 8 — Multi-Step Processing
// ══════════════════════════════════════════════════════════════════
function detectMultiStep(text) {
  const steps = [];
  let remaining = text;

  // "Step 1: X. Step 2: Y."
  const stepRe = /^(?:step|stage)\s*(\d+)\s*[:\-]\s*(.+)/gim;
  remaining = remaining.replace(stepRe, (_, n, content) => {
    steps.push({ n: parseInt(n, 10), content: content.trim() });
    return ' ';
  });

  // "First X, then Y, then Z"
  if (steps.length === 0) {
    const ftRe = /\bfirst[,:]?\s+(.+?)[;,]\s+(?:then|and\s+then)\s+(.+?)(?:[;,]\s+(?:then|finally|and)\s+(.+?))?(?=[.!?]|$)/gi;
    const m = ftRe.exec(remaining);
    if (m) {
      steps.push({ n: 1, content: m[1].trim() });
      steps.push({ n: 2, content: m[2].trim() });
      if (m[3]) steps.push({ n: 3, content: m[3].trim() });
      remaining = remaining.replace(m[0], ' ');
    }
  }

  remaining = collapse(remaining);
  return { steps, remaining };
}

// ══════════════════════════════════════════════════════════════════
//  RESIDUAL PASS — Word-level inline compression (Layers R1–R12)
//  Applied to text not consumed by PCA structural layers
// ══════════════════════════════════════════════════════════════════

const R_EMAIL_PREAMBLE = [
  [/\bI\s+am\s+writing\s+to\s+/gi,                                                    ''],
  [/\bI\s+(?:just\s+)?wanted\s+to\s+reach\s+out\s+(?:to\s+you\s+)?(?:about|regarding|re:?)?\s*/gi, 're: '],
  [/\bI\s+hope\s+(?:this\s+(?:email|message|note)\s+)?finds?\s+you\s+well[,.]?\s*/gi, ''],
  [/\blooking\s+forward\s+to\s+hearing\s+from\s+you[.!]?\s*/gi,                       ''],
  [/\bdon'?t\s+hesitate\s+to\s+(?:reach\s+out|contact|ask)[^.!?]*[.!?]?\s*/gi,       ''],
  [/\bplease\s+let\s+me\s+know\s+if\s+you\s+have\s+any\s+(?:questions?|concerns?)[^.!?]*[.!?]?\s*/gi, ''],
  [/\bI\s+(?:look|am\s+looking)\s+forward\s+to\s+/gi,                                 ''],
  [/\bI\s+(?:would\s+)?(?:really\s+|truly\s+|sincerely\s+|so\s+)?appreciate\s+(?:it\s+)?(?:if\s+(?:you\s+)?(?:could\s+)?)?/gi, ''],
  [/\bmoving\s+forward[,]?\s*/gi,                                                      ''],
  [/\bwithout\s+further\s+ado[,]?\s*/gi,                                               ''],
  [/\bfirst\s+(?:of\s+all|and\s+foremost)[,]?\s*/gi,                                   ''],
  [/\brest\s+assured[,]?\s*/gi,                                                        ''],
];

const R_POLITE_COND = [
  [/\bif\s+(?:it'?s?\s+)?not\s+too\s+much\s+trouble[,]?\s*/gi,        ''],
  [/\bif\s+(?:that'?s?\s+)?okay[,]?\s*/gi,                             ''],
  [/\bif\s+(?:it'?s?\s+)?possible[,]?\s*/gi,                          ''],
  [/\bshould\s+it\s+be\s+(?:applicable|relevant|necessary)[,]?\s*/gi, ''],
  [/\bat\s+your\s+(?:earliest\s+)?convenience[,]?\s*/gi,              ''],
  [/\bfeel\s+free\s+to\s+/gi,                                         ''],
];

const R_SCAFFOLDING = [
  [/\b(?:in\s+this\s+task|for\s+this\s+task)[,]?\s*/gi,       ''],
  [/\bfor\s+(?:your\s+)?(?:reference|context)[,]?\s*/gi,      ''],
  [/\bas\s+(?:you\s+know|requested)[,]?\s*/gi,                ''],
  [/\bjust\s+to\s+clarify[,]?\s*/gi,                          ''],
  [/\bto\s+be\s+(?:clear|specific)[,]?\s*/gi,                 ''],
  [/\b(?:please\s+)?note\s+that[,]?\s*/gi,                    ''],
  [/\bas\s+a\s+reminder[,]?\s*/gi,                            ''],
];

const R_POLITENESS = [
  [/\bplease\s*/gi,                                            ''],
  [/\bcould\s+you\s+(?:please\s+)?/gi,                        ''],
  [/\bwould\s+you\s+(?:mind\s+)?(?:please\s+)?/gi,           ''],
  [/\bcan\s+you\s+(?:please\s+)?/gi,                          ''],
  [/\bI\s+would\s+like\s+(?:you\s+)?(?:to\s+)?/gi,           ''],
  [/\bI'?d\s+like\s+(?:you\s+)?(?:to\s+)?/gi,               ''],
  [/\bI\s+(?:really\s+)?(?:need|want)\s+you\s+to\s+/gi,      ''],
  [/\bI\s+need\s+(?:you\s+to\s+)?/gi,                        ''],
  [/\bkindly\s+/gi,                                           ''],
];

const R_FILLER_PRONOUNS = [
  [/(?:^|(?<=[.!?]\s+))I\s+(?:want|need|would\s+like|am\s+looking)\s+(?:to\s+|you\s+to\s+)?/gim, ''],
  [/(?:^|(?<=[.!?]\s+))You\s+(?:should|need\s+to|will|must|have\s+to)\s+/gim, ''],
  [/(?:^|(?<=[.!?]\s+))We\s+(?:should|need\s+to|will|must)\s+/gim, ''],
];

const R_EXPLETIVES = [
  [/\bthere\s+(?:is|are|was|were)\s+/gi,              ''],
  [/\bit\s+is\s+(?:important\s+(?:to|that)\s+)?/gi,   ''],
  [/\bit\s+(?:was|will\s+be)\s+/gi,                   ''],
  [/\bthis\s+(?:is|was)\s+a\s+/gi,                    ''],
  [/\bthis\s+function\s+(?:is\s+(?:meant|designed)\s+to|will)\s+/gi, 'function: '],
  [/\bthe\s+function\s+(?:is\s+(?:meant|designed)\s+to|will|should)\s+/gi, 'function: '],
];

const R_VERB_PHRASES = [
  [/\b(?:act|serve)\s+as\s+(?:a\s+|an\s+)?(.+?)\s+and\s+/gi,       (_, r) => `${r.trim()}: `],
  [/\bhelp\s+(?:me\s+)?(?:to\s+)?(design|build|create|write|implement|develop|generate|review|analyze|fix|debug|refactor|optimize)\s+/gi, (_, v) => `${v} `],
  [/\b(?:write|create|build|make|develop|implement|code)\s+(?:a\s+|an\s+)?(\w+(?:\s+\w+)?)\s+that\s+/gi, (_, n) => `${n}: `],
  [/\b(?:generate|produce|create|write|output|provide)\s+(?:a\s+|an\s+|the\s+)?(\w+(?:\s+\w+){0,3})\s+for\s+/gi, (_, n) => `${n}: `],
  [/\bthat\s+takes?\s+(?:a\s+|an\s+|the\s+)?(.+?)\s+as\s+input\s*/gi, (_, x) => `input: ${x.trim()} `],
  [/\s+as\s+input\b/gi,                                             ''],
  [/\s+as\s+output\b/gi,                                            ''],
  [/\bthat\s+(?:returns?|outputs?|produces?|gives?)\s+/gi,          '→ '],
  [/\band\s+(?:returns?|outputs?|produces?|gives?)\s+/gi,           '→ '],
  [/\bprovide\s+(?:me\s+)?(?:with\s+)?(?:a\s+|an\s+)?list\s+of\s+/gi, 'list: '],
  [/\bgive\s+(?:me\s+)?(?:a\s+|an\s+)?list\s+of\s+/gi,            'list: '],
  [/\bprovide\s+(?:me\s+)?with\s+/gi,                              ''],
  [/\bgive\s+me\s+/gi,                                             ''],
  [/\bmake\s+sure\s+(?:to|that)\s+/gi,                             'ensure '],
  [/\bin\s+order\s+to\s+/gi,                                       ''],
  [/\bas\s+well\s+as\s+/gi,                                        '+ '],
  [/\bfocus(?:ing)?\s+on\s+/gi,                                    'focus: '],
  [/\bidentify\s+(?:any\s+)?(?:potential\s+)?/gi,                  'find '],
  [/\bcheck\s+for\s+(?:any\s+)?(?:potential\s+)?/gi,              'check: '],
  [/\blook\s+for\s+/gi,                                            'find '],
  [/\b(retrieves?|fetches?)\s+/gi,                                 'get '],
  [/\bincluding\s+/gi,                                             'incl. '],
  [/\breview\s+(?:the\s+)?following\s+(?:code\s+)?(?:snippet|block)?\s*/gi, 'review code: '],
  [/\bthe\s+following\s+(\w+(?:\s+\w+){0,2})\s*/gi,              (_, n) => `${n}: `],
  [/\b(?:below|above)\s+(?:is\s+)?(?:the\s+)?/gi,                ''],
  [/\bgenerate\s+(?:the\s+)?code\s+(?:for\s+)?/gi,               'code: '],
  [/\bwrite\s+(?:the\s+)?code\s+(?:that|to|for|which)\s+/gi,    'code: '],
  [/\b(?:design|architect)\s+(?:a\s+|an\s+|the\s+)?/gi,         ''],
];

const R_POSSESSIVES = [
  [/\bour\s+/gi,        ''],
  [/\byour\s+/gi,       ''],
  [/\bmy\s+/gi,         ''],
  [/\btheir\s+/gi,      ''],
  [/\b(\w{3,})'s\s+/g,  '$1 '],
];

const R_JARGON = [
  [/\bleverage\b/gi,                          'use'],
  [/\butilize\b/gi,                           'use'],
  [/\bfacilitate\b/gi,                        'help'],
  [/\bpain\s+point(?:s)?\b/gi,               'issue'],
  [/\bvalue\s+proposition\b/gi,              'value prop'],
  [/\bkey\s+performance\s+indicator(?:s)?\b/gi, 'KPI'],
  [/\breturn\s+on\s+investment\b/gi,          'ROI'],
  [/\bgo[\s-]to[\s-]market\b/gi,              'GTM'],
  [/\bend[\s-]to[\s-]end\b/gi,               'e2e'],
  [/\breach\s+out\s+(?:to\s+)?/gi,           'contact '],
  [/\btouch\s+base\b/gi,                     'connect'],
  [/\bcircle\s+back\b/gi,                    'revisit'],
  [/\bdeep[\s-]dive\b/gi,                    'analyze'],
  [/\bin\s+the\s+(\w+)\s+industry\b/gi,      (_, n) => n],
  [/\bin\s+the\s+(\w+)\s+(?:space|sector)\b/gi, (_, n) => n],
  [/\bthe\s+fact\s+that\s+/gi,               ''],
  [/\bkeep\s+in\s+mind\s+(?:that\s+)?/gi,   ''],
  [/\btake\s+into\s+account\s+/gi,           'consider '],
  [/\bget\s+back\s+to\s+/gi,                'reply '],
  [/\bin\s+other\s+words[,]?\s+/gi,          ''],
];

const R_TECH_ABBREV = [
  [/\bJavaScript\b/g,        'JS'],
  [/\bTypeScript\b/g,        'TS'],
  [/\bPython\b/g,            'py'],
  [/\bdatabases?\b/gi,       'DB'],
  [/\bapplications?\b/gi,    'app'],
  [/\brepository\b/gi,       'repo'],
  [/\bapplication\s+programming\s+interface\b/gi, 'API'],
  [/\buser\s+interface\b/gi, 'UI'],
  [/\bcommand[\s-]line\s+interface\b/gi, 'CLI'],
  [/\bpull\s+request\b/gi,   'PR'],
  [/\bfunctions?\b/gi,       'fn'],
  [/\bintegers?\b/gi,        'int'],
  [/\bparameters?\b/gi,      'param'],
  [/\barguments?\b/gi,       'arg'],
  [/\bvariables?\b/gi,       'var'],
  [/\bauthentication\b/gi,   'auth'],
  [/\bauthorization\b/gi,    'authz'],
  [/\bconfiguration\b/gi,    'config'],
  [/\bdocumentation\b/gi,    'docs'],
  [/\bimplementation\b/gi,   'impl'],
  [/\brequirements?\b/gi,    'req'],
  [/\bpassword\b/gi,         'pwd'],
  [/\bmessage\b/gi,          'msg'],
  [/\berror(?:s)?\b/gi,      'err'],
  [/\bexception(?:s)?\b/gi,  'exc'],
  [/\bmaximum\b/gi,          'max'],
  [/\bminimum\b/gi,          'min'],
  [/\binformation\b/gi,      'info'],
  [/\bcharacter(?:s)?\b/gi,  'char'],
  [/\bstring(?:s)?\b/gi,     'str'],
  [/\bdirectory\b/gi,        'dir'],
  [/\btemporary\b/gi,        'tmp'],
];

const R_ARTICLES = /\b(a|an|the)\b\s*/gi;

const R_FILLER_ADV = [
  [/\b(?:very|really|quite|rather|somewhat|fairly|extremely|highly|truly|absolutely|completely|totally|utterly|entirely)\s+/gi, ''],
  [/\b(?:basically|simply|just|merely|essentially|effectively|efficiently|properly|correctly|appropriately|carefully|thoroughly)\s+/gi, ''],
  [/\b(?:obviously|clearly|certainly|definitely|undoubtedly|evidently|apparently)\s+/gi, ''],
  [/\b(?:generally|typically|usually|commonly|normally|traditionally)\s+/gi, ''],
  [/\b(?:significantly|substantially|considerably|markedly|notably|remarkably)\s+/gi, ''],
  [/\bcomprehensive\s+/gi,   ''],
  [/\bdetailed\s+/gi,        ''],
  [/\bthorough\s+(?!testing|review|audit)/gi, ''],
  [/\brobust\s+/gi,          ''],
  [/\bfull\s+(?!stack|text|path|match|scan)/gi, ''],
  [/\bcomplete\s+(?!list|set)/gi, ''],
  [/\bproper\s+/gi,          ''],
  [/\befficient\s+/gi,       ''],
  [/\beffective\s+/gi,       ''],
  [/\baccurate\s+/gi,        ''],
  [/\bclear\s+(?!cache)/gi,  ''],
  [/\bconcise\s+/gi,         ''],
  [/\bwell[\s-]structured\s+/gi, ''],
  [/\bappropriate\s+/gi,     ''],
  [/\bpotential\s+/gi,       ''],
  [/\bpossible\s+(?!values|states|options)/gi, ''],
  [/\bnecessary\s+/gi,       ''],
  [/\brelevant\s+/gi,        ''],
  [/\bspecific\s+/gi,        ''],
  [/\bmost\s+(?!of\b|the\b|important\b|critical\b|urgent\b|recent\b)/gi, ''],
  [/\byet\s+(?=\w)/gi,       ''],
  [/\band\s+then\s+/gi,      ''],
  [/\bfor\s+each\s+(?:one\b)?\s*/gi, 'per '],
];

const R_HELPING_VERBS = [
  [/\bshould\s+(?!not\b|n'?t\b)/gi,  ''],
  [/\bwill\s+(?!not\b|n'?t\b)/gi,    ''],
  [/\bwould\s+(?!not\b|n'?t\b)/gi,   ''],
  [/\bmay\s+(?!not\b)/gi,            ''],
  [/\bmight\s+(?!not\b)/gi,          ''],
  [/\bcan\s+(?!not\b|n'?t\b)/gi,     ''],
  [/\bis\s+able\s+to\s+/gi,          ''],
  [/\bare\s+able\s+to\s+/gi,         ''],
  [/\bneeds?\s+to\s+be\s+/gi,        ''],
  [/\b(?:is|are|was|were)\s+going\s+to\s+/gi, ''],
  [/\b(?:is|are)\s+supposed\s+to\s+/gi, ''],
  [/\bbe\s+sure\s+to\s+/gi,          ''],
];

const R_RELATIVES = [
  [/\bwhich\s+(?:is|are|was|were)\s+/gi,                   ''],
  [/[,]?\s+which\s+(?!ever)/gi,                             ' '],
  [/\bthat\s+(?:is|are|was|were)\s+/gi,                    ''],
  [/\bwho\s+(?:is|are|was|were)\s+/gi,                     ''],
  [/(?:^|(?<=[.!?]\s+))(?:Furthermore|Additionally|Moreover|However|Therefore|Thus|Hence|Consequently|As\s+a\s+result|In\s+addition|In\s+conclusion|Finally|Lastly|Firstly)[,]?\s+/gim, ''],
  [/\bsuch\s+as\s+/gi,                                     'e.g. '],
  [/\bin\s+terms\s+of\s+/gi,                               ''],
  [/\bwith\s+respect\s+to\s+/gi,                           ''],
  [/\bwith\s+regard(?:s)?\s+to\s+/gi,                     ''],
  [/\bin\s+the\s+context\s+of\s+/gi,                      ''],
];

const R_TRAILING = [
  [/\bfrom\s+that\s+list\b/gi,        ''],
  [/\bthe\s+result(?:ing)?\s+/gi,     ''],
  [/\bthe\s+output\s+of\s+/gi,        'output: '],
  [/\busing\s+the\s+/gi,              'using '],
  [/\bbased\s+on\s+(?:the\s+)?/gi,   'from '],
  [/\brelated\s+to\s+/gi,            're: '],
  [/\bin\s+(?:a|an)\s+(?=\w)/gi,     'in '],
  [/\bdo\s+not\s+/gi,               'no '],
  [/\bdoes\s+not\s+/gi,             'no '],
  [/\bdid\s+not\s+/gi,              'no '],
];

function compressResidual(text) {
  if (!text.trim()) return '';
  let t = text;
  const pass = (pairs) => { t = collapse(rep(t, pairs)); };

  pass(R_EMAIL_PREAMBLE);
  pass(R_POLITE_COND);
  pass(R_SCAFFOLDING);
  pass(R_POLITENESS);
  pass(R_FILLER_PRONOUNS);
  pass(R_EXPLETIVES);
  pass(R_VERB_PHRASES);
  pass(R_POSSESSIVES);
  pass(R_JARGON);
  pass(R_TECH_ABBREV);
  t = collapse(t.replace(R_ARTICLES, ''));
  pass(R_FILLER_ADV);
  pass(R_HELPING_VERBS);
  pass(R_RELATIVES);
  pass(R_TRAILING);

  // ── Orphan fragment cleanup ────────────────────────────────────
  // Remove dangling imperative verbs/fragments left after PCA layer extraction
  t = t
    .replace(/\b(?:use|apply|follow|employ)\s*[.!,]?\s*/gi, '')
    .replace(/\bkeep\s+it\s*[.!,]?\s*/gi, '')
    .replace(/\b(?:add|include|generate|write|create)\s+(?:it\s+)?(?:also\s+)?[.!,]?\s*/gi, '')
    .replace(/\bplease\s+[.!,]?\s*/gi, '')
    // Remove sentences that are just "Word." (single orphaned word with punctuation)
    .replace(/(?:^|\.\s+)([A-Z][a-z]{0,8})\.\s*/g, (m, w) => {
      // keep it if it looks like a meaningful sentence fragment
      if (/^(?:Note|Also|However|This|But|See|Run|Try|Check|Test|Build|Deploy)$/.test(w)) return m;
      return ' ';
    });

  // Final punctuation cleanup
  t = t
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/([.:,])\s*([.:,])/g, '$1')
    .replace(/→\s*→/g, '→')
    .replace(/:\s*:/g, ':')
    .replace(/^[,;.\s]+/, '')
    .replace(/[,;\s]+$/, '')
    .replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (t) t = t.charAt(0).toUpperCase() + t.slice(1);
  return t;
}

// ══════════════════════════════════════════════════════════════════
//  ASSEMBLY — Build PCA-formatted output
// ══════════════════════════════════════════════════════════════════
function assemblePCA(parts, residual) {
  const lines = [];
  const { brain, vars, methods, rules, outputs, maxWords, steps } = parts;

  if (brain)             lines.push(`BRAIN: ${brain}`);
  if (vars.task)         lines.push(`Task: ${vars.task}`);
  if (vars.company)      lines.push(`Co: ${vars.company}`);
  if (vars.persona)      lines.push(`Persona: ${vars.persona}`);
  if (vars.industry && !brain?.toLowerCase().includes(vars.industry.toLowerCase()))
                         lines.push(`Industry: ${vars.industry}`);
  if (vars.offer)        lines.push(`Offer: ${vars.offer}`);
  if (vars.signals?.length)
    lines.push('Signals: ' + vars.signals.map(s => `• ${s}`).join(' '));

  const methodLine = [...(methods || []), ...(rules || [])].join(' · ');
  if (methodLine)        lines.push(`Method: ${methodLine}`);

  if (steps?.length)
    steps.forEach(s => lines.push(`Stage ${s.n}: ${s.content}`));

  const outLine = outputs?.join(' + ');
  if (outLine || maxWords != null) {
    let ol = '';
    if (outLine)     ol += `Output: ${outLine}`;
    if (maxWords)    ol += (ol ? ' / ' : '') + `Max: ${maxWords}w`;
    lines.push(ol);
  }

  if (residual)          lines.push(residual);
  return lines.join('\n');
}

// ── Detect whether a prompt has structural PCA signals ────────────
function hasSalesSignals(text) {
  return /\b(?:email|outreach|SDR|prospect|follow[\s-]?up|cold\s+call|pitch|sales\s+deck|linkedin\s+message|deal|CRM|pipeline|account|buyer|persona|demo|B2B)\b/i.test(text);
}

// ══════════════════════════════════════════════════════════════════
//  MAIN EXPORT
// ══════════════════════════════════════════════════════════════════
export function compress(input) {
  if (!input.trim()) return { output: '', steps: [], inputTokens: 0, outputTokens: 0, reduction: 0 };

  const steps = [];
  let remaining = input;

  // ── PCA structural extraction ────────────────────────────────────
  const { brain, remaining: r1 }       = extractBrain(remaining);
  remaining = r1;
  if (brain)
    steps.push({ rule: 'L1 — System Brain', before: input.slice(0, 80), after: `BRAIN: ${brain}` });

  const { vars, remaining: r2 }        = extractVariables(remaining);
  remaining = r2;
  if (Object.keys(vars).length)
    steps.push({ rule: 'L2 — Variable Inputs', before: remaining.slice(0, 80), after: JSON.stringify(vars).slice(0, 120) });

  remaining = compressContext(remaining);

  const { methods, rules, remaining: r3 } = extractMethods(remaining);
  remaining = r3;
  if (methods.length || rules.length)
    steps.push({ rule: 'L5 — Instruction IDs', before: remaining.slice(0, 80), after: [...methods, ...rules].join(' · ') });

  const { exampleCount, remaining: r4 } = compressExamples(remaining);
  remaining = r4;
  if (exampleCount)
    steps.push({ rule: 'L6 — Example Compression', before: `${exampleCount} example(s)`, after: 'Pattern notation' });

  let { outputs, maxWords, remaining: r5 } = extractOutputConstraints(remaining);
  remaining = r5;
  // If the task itself implied an output format (consumed before L7 ran), infer it back
  outputs = inferOutputFromTask(vars.task, outputs);
  if (outputs.length || maxWords != null)
    steps.push({ rule: 'L7 — Output Constraints', before: remaining.slice(0, 80), after: outputs.join(' + ') + (maxWords ? ` / Max:${maxWords}w` : '') });

  const { steps: multiSteps, remaining: r6 } = detectMultiStep(remaining);
  remaining = r6;
  if (multiSteps.length)
    steps.push({ rule: 'L8 — Multi-Step', before: remaining.slice(0, 80), after: multiSteps.map((s, i) => `S${i+1}: ${s.content}`).join(' → ') });

  // ── Residual pass ────────────────────────────────────────────────
  const residual = compressResidual(remaining);
  if (residual !== remaining.trim() && residual)
    steps.push({ rule: 'R — Residual cleanup', before: remaining.slice(0, 80), after: residual.slice(0, 80) });

  // ── Candidate A: PCA structured output ───────────────────────────
  const anyPCA = brain || Object.keys(vars).length || methods.length || rules.length || outputs.length || multiSteps.length;

  let pcaOutput = null;
  if (anyPCA) {
    pcaOutput = assemblePCA({ brain, vars, methods, rules, outputs, maxWords, steps: multiSteps }, residual)
      .replace(/\n{3,}/g, '\n\n').trim();
  }

  // ── Candidate B: pure inline compression of the full input ────────
  const inlineOutput = (() => {
    let t = compressResidual(input);
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : input.trim();
  })();

  // ── Pick the output that saves the most tokens ───────────────────
  // If PCA and inline are within 5% of each other, prefer PCA (richer structure).
  // Otherwise prefer whichever is smaller.
  const inputTokens = estimateTokens(input);
  let output;

  if (pcaOutput) {
    const pcaToks    = estimateTokens(pcaOutput);
    const inlineToks = estimateTokens(inlineOutput);
    if (pcaToks <= inlineToks * 1.05) {
      output = pcaOutput;   // PCA at least as good (or within 5%)
    } else {
      output = inlineOutput; // Inline is meaningfully better
      steps.push({ rule: 'Fallback: inline better than PCA', before: String(pcaToks), after: String(inlineToks) });
    }
  } else {
    output = inlineOutput || input.trim();
  }

  output = output.replace(/\n{3,}/g, '\n\n').trim();

  const outputTokens = estimateTokens(output);
  const reduction    = inputTokens > 0
    ? Math.round((1 - outputTokens / inputTokens) * 100)
    : 0;

  return { output, steps, inputTokens, outputTokens, reduction };
}
