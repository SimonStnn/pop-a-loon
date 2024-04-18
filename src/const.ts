//
// * Config types
//

type _initialConfig = {
  popVolume: number;
} & RemoteConfig;

export const initalConfig: _initialConfig = {
  // Local config
  popVolume: 70,

  // Remote config -> can be overriden by the remote
  badge: {
    color: '#26282b',
    backgroundColor: '#7aa5eb',
  },
  spawnInterval: {
    min: 1000,
    max: 10 * 60000,
  },
};

//
// * Remote types
//

export type User = {
  id: string;
  username: string;
  email?: string;
  count: number;
  updatedAt: string;
  createdAt: string;
};

export type RemoteConfig = {
  badge: {
    color: hexColor;
    backgroundColor: hexColor;
  };
  spawnInterval: {
    min: number;
    max: number;
  };
};

export type RemoteResponse = {
  user: User;
  count: {
    id: string;
    count: number;
    updatedAt: string;
  };
  status: {
    status: 'up';
    version: string;
  };
  configuration: RemoteConfig;
  leaderboard: {
    user: User;
    rank: number;
    topUsers: User[];
  };
};

export type Endpoint = keyof RemoteResponse;

//
// * Storage types
//

type Config = Prettify<typeof initalConfig & RemoteConfig>;

export type StorageStructure = {
  config: Config;
  token: string;
  user: User;
};

export type storageKey = keyof StorageStructure;

//
// * Chrome message types
//

type UpdateCounterMessage = {
  action: 'updateCounter';
  balloonCount: number;
};

type IncrementCount = {
  action: 'incrementCount';
};

type SpawnBalloonMessage = {
  action: 'spawnBalloon';
};

export type Message =
  | UpdateCounterMessage
  | IncrementCount
  | SpawnBalloonMessage;

//
// * Alarms
//

export type AlarmName = 'spawnBalloon' | 'restart';

//
// * Other
//

export type hexColor = string;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
