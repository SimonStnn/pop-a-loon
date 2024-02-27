import { Message, storageKey, StorageStructure } from './const';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function secondsToMilliseconds(seconds: number) {
  return seconds * 1000;
}

export function minutesToMilliseconds(minutes: number) {
  return secondsToMilliseconds(minutes * 60);
}

export function generateRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function sendMessage(message: Message) {
  try {
    chrome.runtime.sendMessage(message);
  } catch (e) {}
}

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

export const storage = new StorageManager();
