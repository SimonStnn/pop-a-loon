export const popSoundUrl = chrome.runtime.getURL('resources/audio/pop.mp3');

export type storageKey = 'balloonCount';

type UpdateCounterMessage = {
  action: 'updateCounter';
  balloonCount: number;
};

type ResetCounterMessage = {
  action: 'resetCounter';
};

export type Message = UpdateCounterMessage | ResetCounterMessage;
