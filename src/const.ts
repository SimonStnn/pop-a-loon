export const balloonImageUrl = chrome.runtime.getURL("resources/images/icon.png");

type UpdateCounterMessage = {
  action: "updateCounter";
  balloonCount: number;
};

export type Message = UpdateCounterMessage;
