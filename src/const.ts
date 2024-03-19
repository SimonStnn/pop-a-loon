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

//
// * Remote types
//

export type User = {
  id: string;
  username: string;
  count: number;
  updatedAt: string;
  createdAt: string;
};

export type RemoteConfig = {
  spawnInterval: {
    min: number;
    max: number;
  };
};

export type RemoteResponse = {
  user: User;
  configuration: RemoteConfig;
  leaderboard: {
    user: User;
    rank: number;
  };
};

export type Endpoint = keyof RemoteResponse;

//
// * Storage types
//

type Config = Prettify<typeof initalConfig & RemoteConfig>;

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
