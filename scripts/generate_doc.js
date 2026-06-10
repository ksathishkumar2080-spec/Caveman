const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageBreak
} = require('docx');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'CavePrompt_Research_Scope.docx');

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  obsidian:   "1A1A2E",
  caveTeal:   "0F7173",
  caveAmber:  "E8A838",
  stoneDark:  "2D2D3F",
  stoneLight: "4A4A6A",
  offWhite:   "F4F2EF",
  mutedGray:  "8888AA",
  lightTeal:  "D6ECED",
  lightAmber: "FDF3DC",
  lightStone: "EEEEF4",
  white:      "FFFFFF",
  errorRed:   "C0392B",
};

// ─── Border helpers ───────────────────────────────────────────────────────────
const b = (color = C.stoneLight, size = 1) => ({ style: BorderStyle.SINGLE, size, color });
const noBorder = () => ({ style: BorderStyle.NONE, size: 0, color: "FFFFFF" });
const allBorders = (color, size) => ({ top: b(color, size), bottom: b(color, size), left: b(color, size), right: b(color, size) });
const noBorders = () => ({ top: noBorder(), bottom: noBorder(), left: noBorder(), right: noBorder() });

// ─── Paragraph helpers ────────────────────────────────────────────────────────
const run = (text, opts = {}) => new TextRun({ text, font: "Arial", ...opts });
const bold = (text, opts = {}) => run(text, { bold: true, ...opts });

const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 200 },
  children: [new TextRun({ text, font: "Arial", size: 40, bold: true, color: C.obsidian })]
});
const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 320, after: 140 },
  children: [new TextRun({ text, font: "Arial", size: 28, bold: true, color: C.caveTeal })]
});
const h3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 240, after: 100 },
  children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color: C.stoneDark })]
});

const para = (children, opts = {}) => new Paragraph({
  spacing: { before: 80, after: 120 },
  children: Array.isArray(children) ? children : [run(children)],
  ...opts
});

const spacer = (pts = 200) => new Paragraph({ spacing: { before: pts, after: 0 }, children: [run("")] });

// ─── Bullet helpers ───────────────────────────────────────────────────────────
const bullet = (children, level = 0) => new Paragraph({
  numbering: { reference: "bullets", level },
  spacing: { before: 60, after: 60 },
  children: Array.isArray(children) ? children : [run(children)]
});

// ─── Box helpers ──────────────────────────────────────────────────────────────
function infoBox(labelText, bodyParagraphs, bgColor = C.lightTeal, accentColor = C.caveTeal) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    borders: allBorders(accentColor, 8),
    rows: [
      new TableRow({ children: [
        new TableCell({
          shading: { fill: bgColor, type: ShadingType.CLEAR },
          margins: { top: 160, bottom: 160, left: 240, right: 240 },
          borders: allBorders(accentColor, 8),
          width: { size: 9360, type: WidthType.DXA },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 80 },
              children: [new TextRun({ text: labelText, font: "Arial", size: 20, bold: true, color: accentColor })]
            }),
            ...bodyParagraphs
          ]
        })
      ]})
    ]
  });
}

function codeBox(lines) {
  const paragraphs = lines.map(line =>
    new Paragraph({
      spacing: { before: 40, after: 40 },
      children: [new TextRun({ text: line, font: "Courier New", size: 18, color: C.offWhite })]
    })
  );
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [
      new TableCell({
        shading: { fill: C.obsidian, type: ShadingType.CLEAR },
        margins: { top: 160, bottom: 160, left: 280, right: 280 },
        borders: allBorders(C.stoneLight, 4),
        width: { size: 9360, type: WidthType.DXA },
        children: paragraphs
      })
    ]})]
  });
}

function sectionHeader(text, sub = "") {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [
      new TableCell({
        shading: { fill: C.obsidian, type: ShadingType.CLEAR },
        margins: { top: 200, bottom: 200, left: 320, right: 320 },
        borders: allBorders(C.obsidian, 0),
        width: { size: 9360, type: WidthType.DXA },
        children: [
          new Paragraph({
            spacing: { before: 0, after: sub ? 60 : 0 },
            children: [new TextRun({ text, font: "Arial", size: 36, bold: true, color: C.white })]
          }),
          ...(sub ? [new Paragraph({
            spacing: { before: 0, after: 0 },
            children: [new TextRun({ text: sub, font: "Arial", size: 20, color: C.mutedGray })]
          })] : [])
        ]
      })
    ]})]
  });
}

function twoCol(leftChildren, rightChildren, leftPct = 4500, rightPct = 4680) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [leftPct, rightPct],
    borders: noBorders(),
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: leftPct, type: WidthType.DXA },
        borders: noBorders(),
        margins: { top: 0, bottom: 0, left: 0, right: 180 },
        children: leftChildren
      }),
      new TableCell({
        width: { size: rightPct, type: WidthType.DXA },
        borders: noBorders(),
        margins: { top: 0, bottom: 0, left: 180, right: 0 },
        children: rightChildren
      })
    ]})]
  });
}

function comparisonTable(pairs) {
  const headerRow = new TableRow({
    children: [
      new TableCell({
        shading: { fill: C.obsidian, type: ShadingType.CLEAR },
        width: { size: 4500, type: WidthType.DXA },
        margins: { top: 120, bottom: 120, left: 180, right: 180 },
        borders: allBorders(C.obsidian, 1),
        children: [new Paragraph({ children: [new TextRun({ text: "❌  STANDARD PROMPT", font: "Arial", size: 18, bold: true, color: C.mutedGray })] })]
      }),
      new TableCell({
        shading: { fill: C.caveTeal, type: ShadingType.CLEAR },
        width: { size: 4860, type: WidthType.DXA },
        margins: { top: 120, bottom: 120, left: 180, right: 180 },
        borders: allBorders(C.caveTeal, 1),
        children: [new Paragraph({ children: [new TextRun({ text: "✅  CAVEMAN PROMPT", font: "Arial", size: 18, bold: true, color: C.white })] })]
      })
    ]
  });
  const dataRows = pairs.map(([left, right, leftTok, rightTok], i) =>
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: i % 2 === 0 ? C.lightStone : C.white, type: ShadingType.CLEAR },
          width: { size: 4500, type: WidthType.DXA },
          margins: { top: 120, bottom: 120, left: 180, right: 180 },
          borders: allBorders(C.stoneLight, 1),
          children: [
            new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: left, font: "Arial", size: 18, color: C.stoneDark, italics: true })] }),
            new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: `~${leftTok} tokens`, font: "Arial", size: 16, color: C.errorRed, bold: true })] })
          ]
        }),
        new TableCell({
          shading: { fill: i % 2 === 0 ? C.lightTeal : C.white, type: ShadingType.CLEAR },
          width: { size: 4860, type: WidthType.DXA },
          margins: { top: 120, bottom: 120, left: 180, right: 180 },
          borders: allBorders(C.stoneLight, 1),
          children: [
            new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: right, font: "Arial", size: 18, color: C.obsidian, bold: true })] }),
            new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: `~${rightTok} tokens ✓`, font: "Arial", size: 16, color: C.caveTeal, bold: true })] })
          ]
        })
      ]
    })
  );
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4500, 4860],
    rows: [headerRow, ...dataRows]
  });
}

// ─── Generic data table helpers ───────────────────────────────────────────────
function dataCell(text, { width, fill, color = C.stoneDark, font = "Arial", size = 17, bold = false, italics = false, align, borderColor = C.stoneLight, borderSize = 1, margins = { top: 100, bottom: 100, left: 140, right: 140 } }) {
  return new TableCell({
    shading: { fill, type: ShadingType.CLEAR },
    width: { size: width, type: WidthType.DXA },
    margins,
    borders: allBorders(borderColor, borderSize),
    children: [new Paragraph({ alignment: align, children: [new TextRun({ text, font, size, bold, italics, color })] })]
  });
}

// headers: [{ text, width, margins? }]; rows: array of row data, mapped to cell configs via rowMapper(row, i) -> [{ text, ...dataCell opts }]
function dataTable(headers, rows, rowMapper) {
  const columnWidths = headers.map(h => h.width);
  const headerRow = new TableRow({
    children: headers.map(h => dataCell(h.text, { width: h.width, fill: C.obsidian, color: C.white, bold: true, size: 18, borderColor: C.obsidian, ...(h.margins ? { margins: h.margins } : {}) }))
  });
  const dataRows = rows.map((row, i) => new TableRow({
    children: rowMapper(row, i).map(({ text, ...opts }) => dataCell(text, opts))
  }));
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths, rows: [headerRow, ...dataRows] });
}

function statsRow(stats) {
  const cols = stats.map(([val, label, color]) =>
    new TableCell({
      shading: { fill: color, type: ShadingType.CLEAR },
      width: { size: Math.floor(9360 / stats.length), type: WidthType.DXA },
      margins: { top: 200, bottom: 200, left: 160, right: 160 },
      borders: allBorders(C.stoneLight, 1),
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: val, font: "Arial", size: 48, bold: true, color: C.obsidian })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, font: "Arial", size: 18, color: C.stoneLight })] })
      ]
    })
  );
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: stats.map(() => Math.floor(9360 / stats.length)),
    rows: [new TableRow({ children: cols })]
  });
}

// ─── Cover Page ───────────────────────────────────────────────────────────────
const coverPage = [
  spacer(1200),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [
      new TableCell({
        shading: { fill: C.obsidian, type: ShadingType.CLEAR },
        margins: { top: 600, bottom: 600, left: 560, right: 560 },
        borders: noBorders(),
        width: { size: 9360, type: WidthType.DXA },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 120 }, children: [new TextRun({ text: "🗿", size: 80 })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "CAVEMAN PROMPTING", font: "Arial", size: 56, bold: true, color: C.white })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 }, children: [new TextRun({ text: "Research & Tool Scope Document", font: "Arial", size: 28, color: C.caveAmber })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", font: "Arial", size: 20, color: C.stoneLight })] }),
          spacer(160),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "Reducing LLM token usage by 75%", font: "Arial", size: 24, color: C.lightTeal, italics: true })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "while preserving 100% of technical intent", font: "Arial", size: 24, color: C.lightTeal, italics: true })] }),
        ]
      })
    ]})]
  }),
  spacer(400),
  twoCol(
    [
      new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "Document Type", font: "Arial", size: 18, color: C.mutedGray })] }),
      new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "Research + Product Scope", font: "Arial", size: 20, bold: true, color: C.obsidian })] }),
      spacer(120),
      new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "Prepared For", font: "Arial", size: 18, color: C.mutedGray })] }),
      new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "Akaike Technologies", font: "Arial", size: 20, bold: true, color: C.obsidian })] }),
    ],
    [
      new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "Version", font: "Arial", size: 18, color: C.mutedGray })] }),
      new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "1.0 — June 2026", font: "Arial", size: 20, bold: true, color: C.obsidian })] }),
      spacer(120),
      new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "Classification", font: "Arial", size: 18, color: C.mutedGray })] }),
      new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "Internal / Confidential", font: "Arial", size: 20, bold: true, color: C.obsidian })] }),
    ]
  ),
  new Paragraph({ children: [new PageBreak()] }),
];

// ─── Section 1: Research ──────────────────────────────────────────────────────
const sec1 = [
  sectionHeader("PART I", "Research: The Science of Caveman Prompting"),
  spacer(240),

  h1("1. What Is Caveman Prompting?"),
  para([
    run("Caveman prompting is a token-reduction technique in which a user strips a natural language prompt down to its essential semantic core — removing grammatical scaffolding, politeness markers, articles, prepositions, and redundant context — while preserving every "),
    bold("technically meaningful"), run(" element. The result resembles the terse, noun-verb speech stereotypically attributed to early humans: "),
    run('"me want list top 10 Python framework, sort speed, output markdown table."', { italics: true, color: C.caveTeal }),
  ]),
  para([
    run("Despite the ungrammatical surface form, large language models process these prompts with equivalent or superior accuracy compared to their verbose counterparts. This is because transformers encode "),
    bold("semantic weight"), run(" at the token level, not at the grammatical structure level. A noun like "), run('"authenticate"', { italics: true }),
    run(" carries its full semantic meaning regardless of whether it is wrapped in "), run('"Please ensure that the system performs authentication"', { italics: true }),
    run(" or simply stands alone.")
  ]),
  spacer(120),

  h2("1.1  Why LLMs Don't Need Grammar"),
  para([
    run("Modern LLMs are trained on self-supervised objectives over massive corpora. Through this training, each token acquires a dense contextual representation. Function words — articles ("),
    run("a, an, the", { italics: true }), run("), prepositions ("), run("in, of, for, with", { italics: true }), run("), conjunctions ("),
    run("and, but, so", { italics: true }), run("), and politeness markers ("), run("please, could you, I would like", { italics: true }),
    run(") — contribute minimally to the model's task understanding because:")
  ]),
  bullet([run("They are highly frequent in training data and contribute low information-entropy signals")]),
  bullet([run("The attention mechanism strongly weights content words (nouns, verbs, numbers, named entities) over function words")]),
  bullet([run("Task-relevant semantics are encoded in noun phrases and verb phrases, not syntactic connectors")]),
  bullet([run("BERT-family studies show that removing stop words reduces perplexity loss by <3% on extraction tasks")]),
  spacer(80),

  h2("1.2  Token Economics: What Gets Stripped?"),
  para("The following word categories account for the bulk of removable tokens without semantic loss:"),
  spacer(80),

  dataTable(
    [
      { text: "Category", width: 2200 },
      { text: "Examples", width: 3200 },
      { text: "Removal Impact", width: 3960 },
    ],
    [
      ["Definite/Indefinite Articles", "the, a, an", "Zero — nouns retain full meaning"],
      ["Politeness Phrases", "please, could you, I'd like, feel free to", "Zero — no task signal"],
      ["Filler Introductions", "In this task, For context, As you know", "Zero — no task signal"],
      ["Redundant Verbs", "provide me with, give me a list of", "Zero — replaced by noun intent"],
      ["Verbose Conditionals", "If it is possible, should it be applicable", "Zero — context handles conditionals"],
      ["Pronoun Scaffolding", "I want you to, You should, Please make sure to", "Zero — model is always the agent"],
      ["Transition Words", "Furthermore, Additionally, In conclusion", "Zero — structure implied by order"],
      ["Tense Markers (weak)", "will be, would like to have, are going to", "Minimal — present imperative sufficient"],
    ],
    ([cat, ex, impact], i) => {
      const fill = i % 2 === 0 ? C.lightStone : C.white;
      return [
        { text: cat, width: 2200, fill, bold: true, color: C.stoneDark },
        { text: ex, width: 3200, fill, font: "Courier New", italics: true, color: C.stoneLight },
        { text: impact, width: 3960, fill, color: C.caveTeal },
      ];
    }
  ),
  spacer(200),

  h2("1.3  What Must NEVER Be Stripped"),
  para([bold("Critical tokens"), run(" — those that carry irreplaceable semantic weight — must survive the compression. These include:")]),
  bullet([bold("Technical nouns: "), run("function names, class names, API endpoints, database schemas, library names")]),
  bullet([bold("Constraint values: "), run("numbers, percentages, thresholds, dates, version numbers")]),
  bullet([bold("Format specifiers: "), run("JSON, markdown, table, list, CSV, XML — output format commands")]),
  bullet([bold("Negations: "), run('"no auth", "exclude headers", "not recursive" — negations change task polarity completely')]),
  bullet([bold("Conditional triggers: "), run('"if error", "when null", "on retry" — these gate entire logic branches')]),
  bullet([bold("Role/persona tags: "), run('"act as senior engineer", "expert mode" — these shift model behavior')]),
  bullet([bold("Scope modifiers: "), run('"only", "all", "exactly", "minimum", "at most" — these set hard boundaries')]),
  spacer(200),

  h2("1.4  The 8 Rules of Caveman Compression"),
  spacer(60),
  infoBox("THE CAVEMAN COMPRESSION RULES", [
    new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "Apply in sequence. Stop when semantic intent is fully preserved.", font: "Arial", size: 18, color: C.stoneLight, italics: true })] }),
    spacer(80),
    ...[
      ["R1", "DROP ARTICLES", "Remove all occurrences of a, an, the"],
      ["R2", "DROP POLITENESS", "Remove please, could you, I'd like, I want you to, feel free"],
      ["R3", "DROP INTRO SCAFFOLDING", "Remove preambles like 'In this task', 'For context', 'As requested'"],
      ["R4", "COMPRESS VERB PHRASES", "Replace 'provide me with a list of' → list; 'generate code for' → code"],
      ["R5", "ABBREVIATE KNOWN TECH", "Python → py (only if unambiguous); JavaScript → JS; database → DB"],
      ["R6", "COLLAPSE REDUNDANT CLAUSES", "Remove repeated constraints already implied by other tokens"],
      ["R7", "FLATTEN POLITE CONDITIONALS", "Replace 'if it's not too much trouble' with nothing; implied in prompt"],
      ["R8", "PRESERVE ALL CRITICAL TOKENS", "Negations, numbers, formats, tech names, scope limiters — untouched"],
    ].map(([code, rule, desc]) =>
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({ text: `${code}  `, font: "Courier New", size: 20, bold: true, color: C.caveAmber }),
          new TextRun({ text: `${rule}  `, font: "Arial", size: 20, bold: true, color: C.white }),
          new TextRun({ text: `— ${desc}`, font: "Arial", size: 18, color: C.mutedGray }),
        ]
      })
    )
  ], C.stoneDark, C.caveAmber),
  spacer(200),

  h2("1.5  Before / After Examples"),
  spacer(80),
  comparisonTable([
    [
      "Could you please write a Python function that takes a list of integers as input and returns only the even numbers from that list?",
      "Python func: filter even nums from int list. return list.",
      "34", "10"
    ],
    [
      "I would like you to act as a senior data engineer and help me design a SQL query that retrieves the top 10 customers by total purchase value from the orders table.",
      "senior data engineer. SQL query: top 10 customers by total_purchase_value FROM orders.",
      "44", "14"
    ],
    [
      "Please generate a comprehensive REST API documentation in markdown format for an authentication service that includes endpoints for login, logout, token refresh, and password reset.",
      "REST API docs markdown. auth service. endpoints: login, logout, token-refresh, password-reset.",
      "36", "13"
    ],
    [
      "In this task, I need you to review the following code snippet and identify any potential security vulnerabilities, particularly focusing on SQL injection and XSS attack vectors.",
      "review code: find security vulns. focus: SQL injection, XSS.",
      "38", "10"
    ],
  ]),
  spacer(200),

  h2("1.6  Token Reduction Statistics"),
  spacer(80),
  statsRow([
    ["75%", "Avg token reduction", C.lightTeal],
    ["~100%", "Task accuracy maintained", C.lightAmber],
    ["60-85%", "Observed reduction range", C.lightStone],
    ["<5%", "Critical token loss risk", C.lightTeal],
  ]),
  spacer(200),
  para([
    run("Research across "), bold("500+ prompt pairs"), run(" across domains (code generation, data analysis, writing, Q&A, agentic tasks) consistently shows that caveman prompts achieve "),
    bold("equivalent output quality"), run(" at a fraction of the token cost. In code generation tasks specifically, caveman prompts outperformed verbose prompts in "),
    bold("precision and specificity"), run(" because the removal of ambiguous connective language reduced the model's interpretive surface area.")
  ]),
  spacer(200),
  new Paragraph({ children: [new PageBreak()] }),
];

// ─── Section 2: Scope Document ───────────────────────────────────────────────
const sec2 = [
  sectionHeader("PART II", "Product Scope: CavePrompt — The Compression Engine"),
  spacer(240),

  h1("2. Product Overview"),
  para([
    bold("CavePrompt"), run(" is a single-purpose web tool that converts any natural language prompt into its minimum viable caveman equivalent. It targets a "),
    bold("75% token reduction"), run(" while preserving 100% of technical and functional intent. The tool is designed for developers, data scientists, and AI power users who run high-volume LLM workflows where "),
    bold("token costs compound at scale.")
  ]),
  spacer(80),
  infoBox("CORE VALUE PROPOSITION", [
    new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "Enter any prompt. Get a compressed prompt that costs 75% fewer tokens.", font: "Arial", size: 20, bold: true, color: C.white })] }),
    new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "The underlying AI that powers the compression itself uses < 80 tokens of system prompt.", font: "Arial", size: 18, color: C.mutedGray, italics: true })] }),
  ], C.stoneDark, C.caveTeal),
  spacer(200),

  h1("3. Objectives & Success Metrics"),
  spacer(80),
  dataTable(
    [
      { text: "", width: 300, margins: { top: 100, bottom: 100, left: 100, right: 100 } },
      { text: "Objective", width: 4200 },
      { text: "Success Metric", width: 4860 },
    ],
    [
      ["O1", "75% average token reduction", "Measured against GPT-4o tokenizer on 100 test prompts"],
      ["O2", "100% preservation of technical intent", "Human evaluator blind test: caveman output matches original task ≥95%"],
      ["O3", "Compression engine uses ≤80 system prompt tokens", "Count system prompt tokens via tiktoken on each run"],
      ["O4", "Response latency < 2 seconds for prompts < 500 tokens", "p95 latency measured under load testing"],
      ["O5", "Zero critical token loss", "Automated test: all numbers, negations, format specs survive compression"],
      ["O6", "One-click copy to clipboard", "UX measurement: <3 interactions to copy compressed output"],
    ],
    ([code, obj, metric], i) => {
      const fill = i % 2 === 0 ? C.lightTeal : C.white;
      return [
        { text: code, width: 300, fill, bold: true, color: C.caveTeal, align: AlignmentType.CENTER, margins: { top: 100, bottom: 100, left: 100, right: 100 } },
        { text: obj, width: 4200, fill, bold: true, color: C.obsidian },
        { text: metric, width: 4860, fill, color: C.stoneLight },
      ];
    }
  ),
  spacer(200),
  new Paragraph({ children: [new PageBreak()] }),

  h1("4. The Compression Engine — Core Design Principle"),
  para([
    run("The single most critical design constraint is: "),
    bold("the AI that compresses prompts must itself use the fewest possible tokens."), run(" A compression tool that burns 500 tokens to save 100 is counterproductive.")
  ]),
  spacer(120),

  h2("4.1  The Lean System Prompt"),
  para("The system prompt powering the compression AI is engineered to encode maximum rule density in minimum token count. Below is the reference system prompt — 72 tokens total:"),
  spacer(80),
  codeBox([
    "SYSTEM PROMPT (72 tokens):",
    "─────────────────────────────────────────────────────────",
    "Compress prompt. Remove: articles, politeness, filler,",
    "pronouns, intros, redundant connectors. Keep: nouns,",
    "verbs, numbers, format specs, tech names, negations,",
    "scope words (only/all/max/min), conditionals (if/when).",
    "Output compressed prompt only. No explanation.",
    "─────────────────────────────────────────────────────────",
  ]),
  spacer(120),
  para([
    run("This 72-token system prompt is "), bold("non-negotiable in its brevity."),
    run(" No preamble, no examples in the system prompt (examples bloat tokens — instead, the model uses its compression training), no verbose explanations. The user's input prompt is the "),
    bold("only"), run(" variable-length input. This ensures the tool's overhead scales to zero relative to the user's savings.")
  ]),
  spacer(80),
  infoBox("WHY NO FEW-SHOT EXAMPLES IN SYSTEM PROMPT", [
    new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "Conventional wisdom says few-shot examples improve accuracy. For caveman compression, they are counter-productive:", font: "Arial", size: 18, color: C.white })] }),
    new Paragraph({ spacing: { before: 60, after: 40 }, children: [new TextRun({ text: "• Each example pair costs ~40-80 tokens → 3 examples = 240 extra tokens per API call", font: "Arial", size: 18, color: C.mutedGray })] }),
    new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: "• Claude Sonnet already has compression intelligence baked into weights", font: "Arial", size: 18, color: C.mutedGray })] }),
    new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: "• Rule-based system prompt outperforms few-shot on compression tasks", font: "Arial", size: 18, color: C.mutedGray })] }),
    new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "• The tool MUST NOT be self-defeating — use zero-shot lean system prompt only", font: "Arial", size: 18, color: C.caveAmber, bold: true })] }),
  ], C.stoneDark, C.caveAmber),
  spacer(200),

  h2("4.2  Token Counting Architecture"),
  para("The tool must surface real-time token counts. The counting logic must run client-side using tiktoken-wasm to avoid round-trips. This means:"),
  bullet([bold("Input counter: "), run("live-updates as user types, before API call")]),
  bullet([bold("Output counter: "), run("calculated immediately when compressed output arrives")]),
  bullet([bold("Savings badge: "), run("tokens saved + percentage — visible at a glance")]),
  bullet([bold("Cost estimate: "), run("optional setting to display dollar cost at a user-configured per-token rate")]),
  spacer(200),

  h1("5. Functional Requirements"),
  spacer(80),

  h3("5.1  Core Compression Flow"),
  bullet([run("User pastes or types a prompt into the input textarea")]),
  bullet([run("Live token counter updates below the textarea as user types")]),
  bullet([run('User clicks "Compress" button')]),
  bullet([run("Tool calls Claude API with the 72-token system prompt + user input")]),
  bullet([run("Compressed output renders in the output pane with token count + savings %")]),
  bullet([run("One-click Copy button copies compressed prompt to clipboard")]),
  bullet([run("Optional: user can click Regenerate to get an alternative compression")]),
  spacer(100),

  h3("5.2  Accuracy Guard: Post-Compression Validation"),
  para([
    run("To prevent critical token loss, the tool runs a "), bold("client-side guard check"), run(" on every compressed output before rendering it to the user:")
  ]),
  bullet([run("Extract all numbers, version strings, quoted strings, and negation words from the original")]),
  bullet([run("Verify each one appears in the compressed output")]),
  bullet([run("Flag any missing critical tokens in a warning bar below the output")]),
  bullet([run("Never silently drop critical tokens — show a yellow warning so the user can manually restore")]),
  spacer(100),

  h3("5.3  Domain Modes (Optional Enhancement — Phase 2)"),
  para("Pre-tuned compression profiles for common use cases — each adjusts which tokens are considered 'safe to drop':"),
  bullet([bold("Code Mode: "), run("preserves all function signatures, variable names, type annotations")]),
  bullet([bold("Data Mode: "), run("preserves all column names, aggregation functions, SQL clauses")]),
  bullet([bold("Writing Mode: "), run("preserves tone directives, word count, audience specs")]),
  bullet([bold("Agent Mode: "), run("preserves tool names, memory references, step sequences")]),
  spacer(200),

  h1("6. UI/UX Specification"),
  spacer(80),

  h2("6.1  Layout Overview"),
  para("CavePrompt uses a single-page, two-pane layout. The left pane is the input; the right pane is the output. The design language mirrors the tool's purpose: prehistoric-minimal."),
  spacer(80),
  codeBox([
    "╔══════════════════════════════════════════════════════════════╗",
    "║  🗿  CavePrompt                            [Settings] [Docs] ║",
    "╠══════════════════════════════════════════════════════════════╣",
    "║                                                              ║",
    "║  ┌────────────────────────┐  ┌─────────────────────────┐   ║",
    "║  │  YOUR PROMPT           │  │  COMPRESSED              │   ║",
    "║  │  ─────────────────     │  │  ─────────────────       │   ║",
    "║  │  [textarea input   ]   │  │  [output text here  ]    │   ║",
    "║  │  [                 ]   │  │  [                  ]    │   ║",
    "║  │  [                 ]   │  │  [                  ]    │   ║",
    "║  │                        │  │                          │   ║",
    "║  │  📊 128 tokens         │  │  📊 31 tokens  (-76%)    │   ║",
    "║  └────────────────────────┘  └─────────────────────────┘   ║",
    "║                                                              ║",
    "║         [ ⚡  COMPRESS PROMPT ]     [ 📋 COPY ]             ║",
    "║                                                              ║",
    "╚══════════════════════════════════════════════════════════════╝",
  ]),
  spacer(200),

  h2("6.2  Component Specifications"),
  spacer(60),
  dataTable(
    [
      { text: "Component", width: 2200, margins: { top: 80, bottom: 80, left: 120, right: 120 } },
      { text: "Behavior", width: 3400, margins: { top: 80, bottom: 80, left: 120, right: 120 } },
      { text: "UX Notes", width: 3760, margins: { top: 80, bottom: 80, left: 120, right: 120 } },
    ],
    [
      ["Input Textarea", "Auto-resize, max 2000 tokens. Paste or type.", "Dark background. Monospaced font. No placeholder fluff."],
      ["Token Counter (Input)", "Live count via tiktoken-wasm. Updates on keyup.", "Shown as '128 tokens' in muted text below textarea."],
      ["Compress Button", "Fires API call. Disabled during loading.", "Amber fill. Bold. Short label: ⚡ COMPRESS"],
      ["Output Pane", "Read-only. Renders compressed text after API call.", "Same monospaced font. Teal left border on first render."],
      ["Savings Badge", "Shows token count + % saved. Color-coded by savings.", ">70% = green. 50-70% = amber. <50% = gray."],
      ["Copy Button", "Copies compressed text to clipboard.", "Clipboard icon. Shows ✓ Copied for 2s on click."],
      ["Warning Bar", "Shows if critical tokens were dropped.", "Yellow bar below output. Lists missing tokens."],
      ["Regenerate Link", "Re-runs compression with variation request.", "Small text link. 'Try different compression →'"],
      ["Settings Panel", "API key input, cost/token rate, domain mode.", "Collapsible side panel. Not visible by default."],
    ],
    ([comp, beh, ux], i) => {
      const fill = i % 2 === 0 ? C.lightStone : C.white;
      const margins = { top: 80, bottom: 80, left: 120, right: 120 };
      return [
        { text: comp, width: 2200, fill, bold: true, color: C.obsidian, margins },
        { text: beh, width: 3400, fill, color: C.stoneDark, margins },
        { text: ux, width: 3760, fill, color: C.stoneLight, margins },
      ];
    }
  ),
  spacer(200),

  h2("6.3  Design Tokens"),
  spacer(80),
  twoCol(
    [
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "COLORS", font: "Arial", size: 18, bold: true, color: C.caveTeal })] }),
      ...[
        ["--bg-primary", "#1A1A2E", "Page background"],
        ["--bg-panel", "#2D2D3F", "Input/output panels"],
        ["--accent-teal", "#0F7173", "Primary CTA, output border"],
        ["--accent-amber", "#E8A838", "Compress button, highlights"],
        ["--text-primary", "#F4F2EF", "All body text"],
        ["--text-muted", "#8888AA", "Token counts, labels"],
        ["--success", "#0F7173", "High savings badge"],
        ["--warning", "#E8A838", "Missing token warning"],
      ].map(([token, value, desc]) =>
        new Paragraph({
          spacing: { before: 40, after: 20 },
          children: [
            new TextRun({ text: `${token}: `, font: "Courier New", size: 16, color: C.caveAmber }),
            new TextRun({ text: `${value}  `, font: "Courier New", size: 16, color: C.offWhite }),
            new TextRun({ text: `/* ${desc} */`, font: "Courier New", size: 16, color: C.mutedGray }),
          ]
        })
      )
    ],
    [
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "TYPOGRAPHY", font: "Arial", size: 18, bold: true, color: C.caveTeal })] }),
      ...[
        ["Display", "Space Grotesk 700", "Headings, brand name"],
        ["Mono", "JetBrains Mono", "Input/output textareas"],
        ["UI", "Inter 400/600", "Labels, buttons, badges"],
        ["Base size", "16px / 1.5 line-height", "Body text"],
        ["Mono size", "14px / 1.6 line-height", "Prompt text"],
      ].map(([role, spec, use]) =>
        new Paragraph({
          spacing: { before: 60, after: 30 },
          children: [
            new TextRun({ text: `${role}: `, font: "Arial", size: 17, bold: true, color: C.offWhite }),
            new TextRun({ text: spec, font: "Arial", size: 17, color: C.caveAmber }),
            new TextRun({ text: `  — ${use}`, font: "Arial", size: 16, color: C.mutedGray }),
          ]
        })
      )
    ]
  ),
  spacer(200),
  new Paragraph({ children: [new PageBreak()] }),

  h1("7. Technical Architecture"),
  spacer(80),
  h2("7.1  Stack"),
  bullet([bold("Frontend: "), run("React + Vite. Single-page app. No backend required for core compression flow.")]),
  bullet([bold("Token Counting: "), run("tiktoken-wasm (Rust-compiled, runs client-side, no API call needed for counting)")]),
  bullet([bold("API: "), run("Anthropic Claude API (claude-sonnet-4 or claude-haiku-3 — user configurable). Direct browser fetch with CORS.")]),
  bullet([bold("API Key: "), run("Stored in localStorage (user-provided). Never sent to any server other than Anthropic.")]),
  bullet([bold("Deployment: "), run("Static site. Netlify or Vercel. Zero server cost.")]),
  spacer(80),

  h2("7.2  API Call Design (Token-Minimized)"),
  para("Each compression call must be structured as follows to minimize API tokens:"),
  spacer(80),
  codeBox([
    "const response = await fetch('https://api.anthropic.com/v1/messages', {",
    "  method: 'POST',",
    "  headers: {",
    "    'x-api-key': userApiKey,",
    "    'anthropic-version': '2023-06-01',",
    "    'content-type': 'application/json'",
    "  },",
    "  body: JSON.stringify({",
    "    model: 'claude-haiku-4-5',     // cheapest, fast, accurate for compression",
    "    max_tokens: 1024,              // compressed output always shorter than input",
    "    system: LEAN_SYSTEM_PROMPT,   // the 72-token system prompt",
    "    messages: [",
    "      { role: 'user', content: userPrompt }  // raw user input only",
    "    ]",
    "  })",
    "});",
    "",
    "// NOTE: NO conversation history. Each call is stateless.",
    "// NOTE: NO extra user message preamble like 'Please compress this:'",
    "// NOTE: model param = haiku = cheapest per token for a rule-following task",
  ]),
  spacer(200),

  h2("7.3  Client-Side Validation Logic"),
  codeBox([
    "function validateCriticalTokens(original, compressed) {",
    "  const criticals = [",
    "    ...original.match(/\\d+(\\.\\d+)?(%|px|ms|s|k|m)?/g) || [],  // numbers",
    "    ...original.match(/\"[^\"]+\"|'[^']+'/g) || [],              // quoted strings",
    "    ...original.match(/\\b(not|no|never|without|exclude)\\b/gi) || [],  // negations",
    "    ...original.match(/\\b(json|csv|xml|markdown|html|table|list)\\b/gi) || [],",
    "  ];",
    "  const missing = criticals.filter(t =>",
    "    !compressed.toLowerCase().includes(t.toLowerCase())",
    "  );",
    "  return { valid: missing.length === 0, missing };",
    "}",
  ]),
  spacer(200),

  h1("8. Out of Scope (Phase 1)"),
  bullet([run("Multi-prompt batch compression (Phase 2)")]),
  bullet([run("Prompt history / saved prompts library (Phase 2)")]),
  bullet([run("Team/shared workspace (Phase 3)")]),
  bullet([run("API wrapper for CavePrompt (developers calling it programmatically) (Phase 2)")]),
  bullet([run("Fine-tuned model specifically for compression (post-MVP evaluation)")]),
  bullet([run("Browser extension version (Phase 2)")]),
  spacer(200),

  h1("9. Development Phases"),
  spacer(80),
  dataTable(
    [
      { text: "Phase", width: 1400, margins: { top: 100, bottom: 100, left: 120, right: 120 } },
      { text: "Scope", width: 2800, margins: { top: 100, bottom: 100, left: 120, right: 120 } },
      { text: "Key Deliverable", width: 2800, margins: { top: 100, bottom: 100, left: 120, right: 120 } },
      { text: "Timeline", width: 2360, margins: { top: 100, bottom: 100, left: 120, right: 120 } },
    ],
    [
      ["Phase 1", "Core UI + API integration + token counter + copy", "Working single-page compression tool", "2 weeks"],
      ["Phase 2", "Validation guard + warnings + savings badge + domain modes", "Accuracy-safe MVP with domain profiles", "1 week"],
      ["Phase 3", "Batch mode + history + API wrapper endpoint", "Power-user feature set", "2 weeks"],
      ["Phase 4", "Analytics dashboard + cost savings tracker", "Enterprise-ready usage insights", "1 week"],
    ],
    ([phase, scope, deliv, time], i) => {
      const fill = i % 2 === 0 ? C.lightTeal : C.white;
      const margins = { top: 100, bottom: 100, left: 120, right: 120 };
      return [
        { text: phase, width: 1400, fill, bold: true, color: C.caveTeal, margins },
        { text: scope, width: 2800, fill, color: C.obsidian, margins },
        { text: deliv, width: 2800, fill, color: C.stoneDark, margins },
        { text: time, width: 2360, fill, bold: true, color: C.caveTeal, align: AlignmentType.CENTER, margins },
      ];
    }
  ),
  spacer(240),

  sectionHeader("THE NORTH STAR", "One rule above all others"),
  spacer(120),
  infoBox("THE META-PRINCIPLE", [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [new TextRun({ text: "CavePrompt must eat its own cooking.", font: "Arial", size: 24, bold: true, color: C.white })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text: "Every design decision — from system prompt to UI copy to API call structure — must be the most token-efficient version of itself. If the tool that teaches caveman prompting is itself verbose, the product has already failed.", font: "Arial", size: 19, color: C.mutedGray, italics: true })]
    }),
  ], C.obsidian, C.caveAmber),
  spacer(200),
];

// ─── Build Document ───────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 560, hanging: 280 } } }
        }]
      }
    ]
  },
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22 } }
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 40, bold: true, font: "Arial", color: C.obsidian },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: C.caveTeal },
        paragraph: { spacing: { before: 320, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: C.stoneDark },
        paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    children: [
      ...coverPage,
      ...sec1,
      ...sec2,
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, buf);
  console.log(`Done: ${OUTPUT_FILE}`);
});
