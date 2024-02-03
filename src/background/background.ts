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
    switch (message.action) {
      case "resetCounter":
        storage.set("balloonCount", { balloonCount: 0 });
        chrome.action.setBadgeText({ text: "0" });
        break;
      case "updateCounter":
        chrome.action.setBadgeText({
          text: message.balloonCount.toString(),
        });
        break;
    }
  }
);
