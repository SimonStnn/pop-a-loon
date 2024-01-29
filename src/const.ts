export const balloonImageUrl = chrome.runtime.getURL("icons/icon.png");

type UpdateCounterMessage = {
  action: "updateCounter";
  balloonCount: number;
};

export type Message = UpdateCounterMessage;
