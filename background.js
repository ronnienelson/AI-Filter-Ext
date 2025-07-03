// background.js

const OPENAI_KEY = "";

// Listen for classify requests
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== "CLASSIFY") return;
  classifyBatch(msg.snippets).then(sendResponse);
  return true; // keep channel open
});

async function classifyBatch(snippets) {
  const prompt = `For each line, respond with a number between 0 and 1 indicating how strongly it markets itself as an AI product:\n` +
                 snippets.map((s, i) => `${i+1}. ${s}`).join("\n");

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 200
    })
  });
  const data = await resp.json();
  // parse lines like "1: 0.85", etc.
  const text = data.choices[0].message.content;
  return text.split("\n").map(line => parseFloat(line.split(":")[1] || 0));
}
