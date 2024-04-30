import { StorageStructure, initalConfig, storageKey } from '@const';

const defaultStorage: StorageStructure = {
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

let mockStorage: StorageStructure = defaultStorage;

export default {
  runtime: {
    getURL: jest.fn(),
    onInstalled: {
      addListener: jest.fn(),
    },
  },
  storage: {
    sync: {
      get: jest.fn(async (key: storageKey) => {
        return mockStorage[key];
      }),
      set: jest.fn(async (data) => {
        mockStorage = { ...mockStorage, ...data };
      }),
      remove: jest.fn(async (key: storageKey) => {
        delete mockStorage[key];
      }),
      clear: jest.fn(async () => {
        mockStorage = defaultStorage;
      }),
    },
  },
};
