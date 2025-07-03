document.addEventListener("DOMContentLoaded", async () => {
  const { useAI, threshold } = await chrome.storage.sync.get({
    useAI: false, threshold: 0.7
  });
  document.getElementById("useAI").checked = useAI;
  document.getElementById("threshold").value = threshold;
});

document.getElementById("save").addEventListener("click", async () => {
  const useAI = document.getElementById("useAI").checked;
  const threshold = parseFloat(document.getElementById("threshold").value);
  await chrome.storage.sync.set({ useAI, threshold });
  window.close();
});
