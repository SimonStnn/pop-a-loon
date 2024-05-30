import log from 'loglevel';

//
// * Config types
//

type _initialConfig = {
  popVolume: number;
  spawnRate: number;
} & RemoteConfig;

export const initalConfig: _initialConfig = {
  // Local config
  popVolume: 70,
  spawnRate: 1,

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

export type Endpoint =
  | '/status'
  | '/configuration'
  | '/user/new'
  | '/user/:id'
  | '/user'
  | '/user/count/increment'
  | '/leaderboard';

//
// * Storage types
//

type Config = Prettify<typeof initalConfig & RemoteConfig>;

export type SyncStorageStructure = {
  config: Config;
  token: string;
  user: User;
};
export type SyncStorageKey = keyof SyncStorageStructure;

export type SessionStorageStructure = {
  loglevel?: log.LogLevelNumbers;
};
export type SessionStorageKey = keyof SessionStorageStructure;

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
// * Development
//

const dev_user: User = {
  id: '6623b79f2fc0a498832e993d',
  username: 'John',
  email: '',
  count: 0,
  updatedAt: '2021-10-10T10:00:00Z',
  createdAt: '2021-10-10T10:00:00Z',
};

export const devRemoteResponse: Record<Endpoint, any> = new Proxy(
  {
    '/status': { status: 'up', version: '1.0.0' },
    '/configuration': {
      ...initalConfig,
      spawnInterval: {
        min: 500,
        max: 0.01 * 60000,
      },
    },
    '/user/count/increment': {},
    '/user/new': { token: 'token', ...dev_user },
    '/user/:id': dev_user,
    '/user': dev_user,
    '/leaderboard': {
      user: dev_user,
      rank: 1,
      topUsers: Array.from({ length: 10 }, (_, i) => ({
        ...dev_user,
        username: `User_${i}`,
        count: (10 - i) * 10,
      })),
    },
  },
  {
    get: function (target, prop, receiver) {
      if (prop === '/user/count/increment') {
        return {
          id: dev_user.id,
          count: ++dev_user.count,
          updatedAt: new Date().toISOString(),
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  }
);

//
// * Other
//

export const BalloonContainerId = 'balloon-container';

export type hexColor = string;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
