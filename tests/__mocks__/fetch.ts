// tests/fetchMock.ts
import fetchMock from 'jest-fetch-mock';
import { initalConfig, RemoteResponse, User } from '@/const';

fetchMock.enableMocks();

const testToken = 'testToken';

export const user: User = {
  id: '123',
  username: 'test',
  email: '',
  count: 0,
  updatedAt: '2021-01-01T00:00:00Z',
  createdAt: '2021-01-01T00:00:00Z',
};

const response: RemoteResponse = {
  status: {
    status: 'up',
    version: '1.0.0',
  },
  configuration: {
    ...initalConfig,
    spawnInterval: {
      min: 1000,
      max: 0.01 * 60000,
    },
  },
  user: user,
  count: {
    id: user.id,
    count: user.count,
    updatedAt: user.updatedAt,
  },
  leaderboard: {
    user: user,
    rank: 1,
    topUsers: [user],
  },
  popHistory: {
    history: [],
  },
  statistics: {
    totalPopped: 0,
  },
};

export const mockFetchResponse = () => {
  fetchMock.resetMocks();
  fetchMock.mockIf(/^https?:\/\/.+$/, async (req) => {
    switch (true) {
      case req.method === 'GET' && req.url.endsWith('/status'):
        return JSON.stringify(response.status);
      case req.method === 'GET' && req.url.endsWith('/configuration'):
        return JSON.stringify(response.configuration);
      case req.method === 'POST' && req.url.endsWith('/user/new'):
        return JSON.stringify(response.user);
      case req.method === 'GET' && req.url.endsWith(`/user/${user.id}`):
        return JSON.stringify(response.user);
      case req.method === 'PUT' && req.url.endsWith('/user'):
        return JSON.stringify({ ...user, token: testToken });
      case req.method === 'DELETE' && req.url.endsWith('/user'):
        return JSON.stringify(user);
      case req.method === 'POST' && req.url.endsWith('/user/count/increment'):
        response.count.count++;
        return JSON.stringify(response.count);
      default:
        return JSON.stringify({});
    }
  });
};
