import { Message } from "./const";

export function generateRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function sendMessage(message: Message) {
  try {
    chrome.runtime.sendMessage(message);
  } catch (e) {}
}

export function incrementBalloonCount() {
  chrome.storage.sync.get(["balloonCount"], (result) => {
    const balloonCount = (result.balloonCount || 0) + 1;
    chrome.storage.sync.set({ balloonCount });

    sendMessage({ action: "updateCounter", balloonCount });
  });
}
