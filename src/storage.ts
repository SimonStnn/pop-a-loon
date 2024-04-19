import browser from 'webextension-polyfill';
import { storageKey, StorageStructure } from '@const';

class StorageManager {
  private _storage: browser.Storage.StorageAreaSync;

  constructor() {
    this._storage = browser.storage.sync;
  }

  async get<K extends storageKey>(key: K): Promise<StorageStructure[K]> {
    const result = await this._storage.get(key);
    return result[key];
  }

  async set<K extends storageKey>(key: K, value: StorageStructure[K]) {
    return await this._storage.set({ [key]: value });
  }

  async remove<K extends storageKey>(key: K) {
    return await this._storage.remove(key);
  }

  async clear() {
    return await this._storage.clear();
  }
}

export default new StorageManager();
