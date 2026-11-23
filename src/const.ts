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
  hasRecoveryCode?: boolean;
  count: number;
  updatedAt: string;
  createdAt: string;
};

export type HistoryBucket = 'day' | 'week' | 'month';

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
  recoveryCode: {
    code: string;
  };
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
  spawnToken: {
    serverTime: number;
    spawnToken: string;
    balloonType: BalloonName;
    spawnAt: number;
    expiresAt: number;
  };
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
    bucket?: HistoryBucket;
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
  | '/configuration/spawn-token'
  | '/user/new'
  | '/user/recovery-code'
  | '/auth/recover'
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
  snooze: number | null;
  accountInitialized?: boolean;
  needsRecovery?: boolean;
  recoveryCodeSaved?: boolean;
};
export type SyncStorageKey = keyof SyncStorageStructure;

// The backend's server-owned spawn schedule, cached locally so the background
// worker can survive suspension between scheduling and spawning.
export type SpawnSchedule = {
  spawnToken: string;
  balloonType: BalloonName;
  spawnAt: number;
  expiresAt: number;
  spawned?: boolean;
};

export type LocalStorageStructure = {
  loglevel?: LogLevelNumbers;
  pendingRecoveryCode?: string;
  spawnSchedule?: SpawnSchedule;
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
  spawnToken?: string;
};

type SpawnBalloonMessage = {
  action: 'spawnBalloon';
};

type SetLogLevelMessage = {
  action: 'setLogLevel';
  level: LogLevelNumbers;
};

type GetDebugInfoMessage = {
  action: 'getDebugInfo';
};

type GetSpawnTokenMessage = {
  action: 'getSpawnToken';
};

export type SpawnTokenMessageResponse = Pick<
  SpawnSchedule,
  'spawnToken' | 'balloonType'
>;

/** State that only lives in the background worker. */
export type DebugInfoResponse = {
  startedAt: number;
  lastSpawn: number | null;
  spawnTimeout: number | null;
  remoteAvailable: boolean | null;
  remoteLastChecked: number | null;
  logLevel: LogLevelNumbers;
  version: string;
  mode: string;
  browser: string;
};

export type Message =
  | UpdateCounterMessage
  | IncrementCount
  | SpawnBalloonMessage
  | SetLogLevelMessage
  | GetDebugInfoMessage
  | GetSpawnTokenMessage;

//
// * Alarms
//

export type AlarmName =
  | 'spawnBalloon'
  | 'refreshSpawnToken'
  | 'retrySpawnToken'
  | 'restart';

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
    '/configuration/spawn-token': {
      serverTime: Date.now(),
      spawnToken: 'dev-token-' + Math.random().toString(36).slice(2),
      balloonType: 'default' as BalloonName,
      spawnAt: Date.now() + 5000,
      expiresAt: Date.now() + 35000,
    },
    '/user/new': { token: 'token', ...dev_user },
    '/user/recovery-code': { code: 'ABCD-EFGH-JKLM-NPQR-STUV-WXYZ' },
    '/auth/recover': { token: 'token', ...dev_user },
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
      scores: [
        { name: 'default', count: 10 },
        { name: 'confetti', count: 20 },
        { name: 'gold', count: 30 },
      ],
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

export type BalloonInstance = InstanceType<
  (typeof Balloons)[keyof typeof Balloons]
>;
export type BalloonName = BalloonInstance['name'];

export type hexColor = string;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
