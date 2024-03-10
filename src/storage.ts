import { storageKey, StorageStructure } from '@const';

class StorageManager {
  private _storage: chrome.storage.SyncStorageArea;

  constructor() {
    this._storage = chrome.storage.sync;
  }

  get<K extends storageKey>(key: K): Promise<StorageStructure[K]> {
    return new Promise((resolve, reject) => {
      this._storage.get([key], (result) => {
        resolve(result[key]);
      });
    });
  }

  set<K extends storageKey>(key: K, value: StorageStructure[K]): Promise<void> {
    return new Promise((resolve, reject) => {
      this._storage.set({ [key]: value }, () => {
        resolve();
      });
    });
  }
}

export default new StorageManager();
