// tests/fetchMock.ts
import { initalConfig, RemoteResponse, User } from '@/const';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

const testToken = 'testToken';

const user: User = {
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
};

export const mockFetchResponse = () => {
  fetchMock.resetMocks();
  fetchMock.mockIf(
    (req) => req.method === 'GET' && req.url.endsWith('/status'),
    JSON.stringify(response.status)
  );
  fetchMock.mockIf(
    (req) => req.method === 'GET' && req.url.endsWith('/configuration'),
    JSON.stringify(response.configuration)
  );
  fetchMock.mockIf(
    (req) => req.method === 'POST' && req.url.endsWith('/user/new'),
    JSON.stringify(response.user)
  );
  fetchMock.mockIf(
    (req) => req.method === 'GET' && req.url.endsWith(`/user/${user.id}`),
    JSON.stringify(response.user)
  );
  fetchMock.mockIf(
    (req) => req.method === 'PUT' && req.url.endsWith('/user'),
    JSON.stringify({ ...user, token: testToken })
  );
  fetchMock.mockIf(
    (req) => req.method === 'DELETE' && req.url.endsWith('/user'),
    JSON.stringify(user)
  );
  fetchMock.mockIf(
    (req) => req.method === 'POST' && req.url.endsWith('/user/count/increment'),
    (() => {
      response.count.count++;
      return JSON.stringify(response.count);
    })()
  );
};
