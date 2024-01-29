export const balloonImageUrl = chrome.runtime.getURL("resources/images/icon.png");
export const popSoundUrl = chrome.runtime.getURL("resources/audio/pop.mp3");

type UpdateCounterMessage = {
  action: "updateCounter";
  balloonCount: number;
};

export type Message = UpdateCounterMessage;
