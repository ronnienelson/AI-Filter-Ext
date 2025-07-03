// ─── CONFIG ────────────────────────────────────────────────────────────────
const DEFAULT_KEYWORDS = [
  "powered by ai",
  "ai-powered",
  "built with ai",
  "ai-driven",
  "ai enhanced",
  "ai-enabled",
  "ai as a service"
];


// result‐block selectors (order matters—newest Google ones first):
// filter.js (top)
const RESULT_SELECTORS = [
  "div.MjjYud",                /* Google latest */
  "div.tF2Cxc",                /* Google older */
  "div.g",                     /* Google fallback */
  "li.b_algo",                 /* Bing */
  "div.result",                /* DuckDuckGo */
  "div.Post",                  /* New Reddit posts */
  "div[data-test-id='pin']",    /* Pinterest pins */
  "div[data-testid='post-container']",
  "article[data-testid='post']",
  "article[id^='t3_']",
    "shreddit-post[id^='t3_']",
      "shreddit-post[id^='t3_']",
  "search-telemetry-tracker[data-testid='search-sdui-post']",
  "search-telemetry-tracker[data-thingid^='t3_']",
];

const AI_BATCH_SIZE = 20;
const DEBUG = true;


// ─── STATE ─────────────────────────────────────────────────────────────────
let settings = {
  useAI: false,
  threshold: 0.7,
  keywords: DEFAULT_KEYWORDS
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
function log(...args) {
  if (DEBUG) console.log("[AI-Filter]", ...args);
}

async function loadSettings() {
  const stored = await chrome.storage.sync.get({
    useAI: false,
    threshold: 0.7,
    keywords: DEFAULT_KEYWORDS
  });
  settings.useAI     = stored.useAI;
  settings.threshold = parseFloat(stored.threshold) || 0.7;
  settings.keywords  = stored.keywords
    .map(k => k.trim().toLowerCase())
    .filter(Boolean);
  log("Loaded settings:", settings);
}

function getResultNodes(root = document) {
  return Array.from(
    root.querySelectorAll(RESULT_SELECTORS.join(","))
  );
}

function hideNode(node, reason) {
  node.style.display = "none";
  log("Hiding node (", reason, "):", node.querySelector("a")?.href || "[no link]");
}

function scanAndFilter() {
  const nodes = getResultNodes();
  let hiddenByKeyword = 0;
  const ambiguous = [];

  nodes.forEach(node => {
    const text = node.innerText.toLowerCase();
    // 1) Keyword filter
    if (settings.keywords.some(k => text.includes(k))) {
      hideNode(node, `keyword match`);
      hiddenByKeyword++;
    }
    // 2) Potential AI candidates
    else if (settings.useAI) {
      ambiguous.push({ node, snippet: text, url: node.querySelector("a")?.href });
    }
  });

  log(`Scan complete: ${nodes.length} total, ${hiddenByKeyword} hidden by keywords, ${ambiguous.length} for AI.`);

  if (settings.useAI && ambiguous.length) {
    const batch = ambiguous.slice(0, AI_BATCH_SIZE);
    const snippets = batch.map(x => x.snippet);
    chrome.runtime.sendMessage(
      { type: "CLASSIFY", snippets },
      labels => applyAIResults(labels, batch)
    );
  }
}

function applyAIResults(labels = [], batch = []) {
  log("AI labels returned:", labels);
  batch.forEach((item, idx) => {
    const score = parseFloat(labels[idx]) || 0;
    if (score >= settings.threshold) {
      hideNode(item.node, `AI score ${score.toFixed(2)}`);
    }
  });
}

// ─── BOOTSTRAP ──────────────────────────────────────────────────────────────
(async function init() {
  await loadSettings();
  scanAndFilter();

  // Re-run on dynamically injected results
  const obs = new MutationObserver(() => scanAndFilter());
  obs.observe(document.body, { childList: true, subtree: true });
})();
