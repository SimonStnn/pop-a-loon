import * as Balloons from '@/balloons';
import { LogLevelNumbers } from '@/managers/log';

//
// * Config types
//

type _initialConfig = {
  popVolume: number;
  spawnRate: number;
  fullScreenVideoSpawn: boolean;
} & RemoteConfig;

export const initalConfig: _initialConfig = {
  // Local config
  popVolume: 70,
  spawnRate: 1,
  fullScreenVideoSpawn: false,

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
  username?: string;
  email?: string;
  count: number;
  updatedAt: string;
  createdAt: string;
};

export type HistoryNode = {
  date: Date;
  pops: Record<BalloonName, number>;
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
    rank: number | null;
    topUsers: User[];
  };
  statistics: {
    totalPopped: number;
  };
  popHistory: {
    history: HistoryNode[];
  };
  scores: {
    scores: {
      name: BalloonName;
      count: number;
    }[];
  };
};

export type Endpoint =
  | '/status'
  | '/configuration'
  | '/user/new'
  | '/user/:id'
  | '/user'
  | '/user/count/increment'
  | '/leaderboard'
  | '/statistics'
  | '/statistics/history'
  | '/statistics/scores';

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

export type LocalStorageStructure = {
  loglevel?: LogLevelNumbers;
};
export type LocalStorageKey = keyof LocalStorageStructure;

//
// * Chrome message types
//

type UpdateCounterMessage = {
  action: 'updateCounter';
  balloonCount: number;
};

type IncrementCount = {
  action: 'incrementCount';
  type: BalloonName;
};

type SpawnBalloonMessage = {
  action: 'spawnBalloon';
};

type SetLogLevelMessage = {
  action: 'setLogLevel';
  level: LogLevelNumbers;
};

export type Message =
  | UpdateCounterMessage
  | IncrementCount
  | SpawnBalloonMessage
  | SetLogLevelMessage;

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
    '/statistics': { totalPopped: 100 },
    '/statistics/history': {
      history: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2021, 10, i + 1),
        pops: {
          default: Math.floor(Math.random() * 100),
          confetti: Math.floor(Math.random() * 100),
          gold: Math.floor(Math.random() * 100),
        },
      })),
    },
    '/statistics/scores': {
      scores: {
        default: 100,
        confetti: 200,
        gold: 300,
      },
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

type BalloonInstances = InstanceType<(typeof Balloons)[keyof typeof Balloons]>;
export type BalloonName = BalloonInstances['name'];

export type hexColor = string;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
