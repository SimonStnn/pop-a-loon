export const popSoundUrl = chrome.runtime.getURL('resources/audio/pop.mp3');
export const balloonImageUrl = chrome.runtime.getURL(
  'resources/icons/icon-128.png'
);

export const initalConfig = {
  popVolume: 70,
};

export type StorageStructure = {
  balloonCount: { balloonCount: number };
  config: typeof initalConfig;
};

export type storageKey = keyof StorageStructure;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type UpdateCounterMessage = {
  action: 'updateCounter';
  balloonCount: number;
};

type ResetCounterMessage = {
  action: 'resetCounter';
};

type SpawnBalloonMessage = {
  action: 'spawnBalloon';
};

export type Message =
  | UpdateCounterMessage
  | ResetCounterMessage
  | SpawnBalloonMessage;
