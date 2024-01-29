console.log("Hello from popup.ts");

const balloonCount = document.getElementById("balloonCount")!;

function setBalloonCount(count: number) {
  console.log("Setting balloon count:", count);
  
  balloonCount.textContent = count.toString();
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("balloonCount", (result) => {
    console.log("result:", result);
    setBalloonCount(result.balloonCount || 0);
  });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'updateCounter') {
    console.log('Received updated counter:', message);

    // Update the popup UI or perform other actions as needed
    setBalloonCount(message.balloonCount);
  }
});