document.addEventListener("DOMContentLoaded", async () => {
  const { keywords } = await chrome.storage.sync.get({ keywords: [] });
  document.getElementById("keywords").value = keywords.join("\n");
});

document.getElementById("save").addEventListener("click", async () => {
  const keywords = document.getElementById("keywords")
    .value.split("\n")
    .map(s => s.trim())
    .filter(Boolean);
  await chrome.storage.sync.set({ keywords });
  alert("Saved!");
});
