import { initalConfig, SyncStorageKey, SyncStorageStructure } from '@const';

const defaultStorage: SyncStorageStructure = {
  config: initalConfig,
  token: '',
  user: {
    id: '',
    username: '',
    email: '',
    count: 0,
    updatedAt: '',
    createdAt: '',
  },
};

let mockStorage: SyncStorageStructure = defaultStorage;

export default {
  runtime: {
    getURL: jest.fn(),
    onInstalled: {
      addListener: jest.fn(),
    },
  },
  storage: {
    sync: {
      get: jest.fn(async (key: SyncStorageKey) => {
        return mockStorage[key];
      }),
      set: jest.fn(async (data) => {
        mockStorage = { ...mockStorage, ...data };
      }),
      remove: jest.fn(async (key: SyncStorageKey) => {
        delete mockStorage[key];
      }),
      clear: jest.fn(async () => {
        mockStorage = defaultStorage;
      }),
    },
  },
};
