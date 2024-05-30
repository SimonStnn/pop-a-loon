import browser from 'webextension-polyfill';
import {
  type SessionStorageStructure,
  type SyncStorageStructure,
} from '@const';

class StorageManager<StorageStructure extends Record<string, any>> {
  private _storage: browser.Storage.StorageArea;

  constructor(storage: browser.Storage.StorageArea) {
    this._storage = storage;
  }

  async get<K extends keyof StorageStructure & string>(
    key: K
  ): Promise<StorageStructure[K]> {
    const result = await this._storage.get(key);
    return result[key];
  }

  async set<K extends keyof StorageStructure & string>(
    key: K,
    value: StorageStructure[K]
  ) {
    return await this._storage.set({ [key]: value });
  }

  async remove<K extends keyof StorageStructure & string>(key: K) {
    return await this._storage.remove(key);
  }

  async clear() {
    return await this._storage.clear();
  }
}

const storage = {
  sync: new StorageManager<SyncStorageStructure>(browser.storage.sync),
  session: new StorageManager<SessionStorageStructure>(browser.storage.session),
};
export default storage;
