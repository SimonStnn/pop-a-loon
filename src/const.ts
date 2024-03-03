export const popSoundUrl = chrome.runtime.getURL('resources/audio/pop.mp3');
export const balloonImageUrl = chrome.runtime.getURL(
  'resources/icons/icon-128.png'
);

export type StorageStructure = {
  balloonCount: { balloonCount: number };
};

export type storageKey = keyof StorageStructure;

type UpdateCounterMessage = {
  action: 'updateCounter';
  balloonCount: number;
};

type ResetCounterMessage = {
  action: 'resetCounter';
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Message = UpdateCounterMessage | ResetCounterMessage;
