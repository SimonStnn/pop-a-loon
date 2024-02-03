import { Message } from "../const";
import { storage } from "../utils";

(async () => {
  if (typeof window !== "undefined") return;

  chrome.action.setBadgeText({
    text: (await storage.get("balloonCount")).balloonCount.toString(),
  });
})();

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    if (message.action === "updateCounter") {
      console.log("Background Received updated counter:", message);

      chrome.action.setBadgeText({
        text: message.balloonCount.toString(),
      });
    }
  }
);
