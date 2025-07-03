A lightweight browser extension that hides search results and feed posts which market themselves as “AI-powered” or “powered by AI.” Works on Google, Bing, DuckDuckGo, Reddit (classic & search UI) and Pinterest.
Enhanced by using your openaiKey, but not necessary 

---

## 🛠 Features

- **Keyword filter**  
  Instantly hides any result containing your custom marketing keywords (e.g. “powered by AI”, “AI-driven”).
- **AI scoring**  
  Sends ambiguous result snippets to an LLM for content analysis, hiding anything that crosses your “AI-marketing” threshold.
- **Multi-site support**  
  • Google Search  
  • Bing  
  • DuckDuckGo  
  • Reddit feed (`shreddit-post`)  
  • Reddit Search UI (`search-telemetry-tracker`)  
  • Pinterest pins  
- **Customizable**  
  • Add your own keywords & phrases  
  • Tweak AI-confidence threshold  
  • Whitelist domains  
- **Zero external dependencies**  
  Runs entirely in-browser, no server required.

---

## 🚀 Installation

### From GitHub (developer mode)

1. **Clone** this repo:
   ```bash
   git clone https://github.com/ronnienelson/ai-filter-ext.git

