export function generateRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function incrementBalloonCount() {
  chrome.storage.sync.get(["balloonCount"], (result) => {
    const balloonCount = (result.balloonCount || 0) + 1;
    chrome.storage.sync.set({ balloonCount });

    try {
      chrome.runtime.sendMessage({ action: "updateCounter", balloonCount });
    } catch (e) {}
  });
}
