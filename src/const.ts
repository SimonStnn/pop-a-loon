export const balloonImageUrl = chrome.runtime.getURL("icons/icon.png");
export const stylesheetUrl = chrome.runtime.getURL("src/content/style.css");

type UpdateCounterMessage = {
  action: "updateCounter";
  balloonCount: number;
};

export type Message = UpdateCounterMessage;
