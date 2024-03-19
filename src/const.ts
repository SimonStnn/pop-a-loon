export const popSoundUrl = chrome.runtime.getURL('resources/audio/pop.mp3');
export const balloonImageUrl = chrome.runtime.getURL(
  'resources/icons/icon-128.png'
);

//
// * Config types
//

export const initalConfig = {
  popVolume: 70,
};

export type User = {
  token: string;
  id: string;
  username: string;
  email: string;
};

export type RemoteConfig = {
  spawnInterval: {
    min: number;
    max: number;
  };
};

type Config = Prettify<User & typeof initalConfig & RemoteConfig>;

//
// * Storage types
//

export type StorageStructure = {
  balloonCount: { balloonCount: number };
  config: Config;
};

export type storageKey = keyof StorageStructure;

//
// * Chrome message types
//

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

//
// * Other
//

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
