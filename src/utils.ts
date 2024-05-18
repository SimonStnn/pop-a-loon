import browser from 'webextension-polyfill';
import { Message, BalloonContainerId } from '@const';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import storage from '@/storage';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function secondsToMilliseconds(seconds: number) {
  return seconds * 1000;
}

export function minutesToMilliseconds(minutes: number) {
  return secondsToMilliseconds(minutes * 60);
}

export function random(max: number): number;
export function random(min: number, max: number): number;
export function random(minOrMax: number, max?: number): number {
  if (max === undefined) return Math.random() * (minOrMax - 0) + 0;
  return Math.random() * (max - minOrMax) + minOrMax;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendMessage(message: Message) {
  try {
    const res = await browser.runtime.sendMessage(message);
    if (browser.runtime.lastError) {
      console.log(
        'Error sending message:',
        message,
        '\nError message:',
        browser.runtime.lastError
      );
      browser.runtime.lastError;
    }
  } catch (e) {}
}

export function getBrowser() {
  const userAgent = navigator.userAgent.toLocaleLowerCase();

  if (/firefox/i.test(userAgent)) {
    return 'Firefox';
  } else if (/chrome/i.test(userAgent)) {
    return 'Chrome';
  } else {
    return 'Unknown';
  }
}

export function isRunningInBackground() {
  const views = browser.extension?.getViews?.() as Window[] | undefined;
  const isRunningInPopup =
    views?.some((view) => view.location.href.includes('popup.html')) ?? false;
  return !isRunningInPopup;
}

type WeightedRandomOptions<T> = {
  default?: T;
};

export function weightedRandom<T, D = null>(
  results: T[],
  weights: number[],
  options: WeightedRandomOptions<D> = {}
): T | D {
  // Calculate the total weight
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  // Generate a random number between 0 and the total weight
  const randomWeight = Math.random() * totalWeight;

  // Find the index of the selected result based on the random weight
  let weightSum = 0;
  for (let i = 0; i < results.length; i++) {
    weightSum += weights[i];
    if (randomWeight < weightSum) {
      return results[i];
    }
  }

  // Return the default value if no result was selected or null if no default was provided
  return (options.default ?? null) as D;
}

export async function calculateBalloonSpawnDelay() {
  const config = await storage.get('config');
  // Generate a random delay between the min and max spawn interval
  const randomDelay = random(
    config.spawnInterval.min,
    config.spawnInterval.max
  );
  const spawnRateMultiplier = Math.max(0, Math.min(config.spawnRate, 1));

  return randomDelay / spawnRateMultiplier;
}

function createBalloonContainer() {
  const balloonContainer = document.createElement('div');
  balloonContainer.id = BalloonContainerId;
  document.body.appendChild(balloonContainer);
  return balloonContainer;
}
export function getBalloonContainer() {
  return (
    document.getElementById(BalloonContainerId) ?? createBalloonContainer()
  );
}
