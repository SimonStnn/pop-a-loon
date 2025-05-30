import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import browser from 'webextension-polyfill';
import { Message, BalloonContainerId } from '@/const';
import log from '@/managers/log';
import storage from '@/managers/storage';

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
export function random<T>(items: T[]): T;
export function random<T>(...args: T[]): T;
export function random<T>(
  ...args: [number] | [number, number] | T[] | [T[]]
): number | T {
  // Handle `max: number`
  if (args.length === 1 && typeof args[0] === 'number')
    return Math.random() * args[0];
  // Handle `items: T[]`
  else if (args.length === 1 && Array.isArray(args[0]))
    return args[0][Math.floor(random(args[0].length))];
  // Handle `min: number, max: number`
  else if (
    args.length === 2 &&
    typeof args[0] === 'number' &&
    typeof args[1] === 'number'
  ) {
    const [min, max] = args;
    return Math.random() * (max - min) + min;
  }
  // Handle `...args: T[]`
  const items = args as T[];
  return items[Math.floor(random(items.length))];
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendMessage(message: Message) {
  try {
    const res = await browser.runtime.sendMessage(message);
    if (browser.runtime.lastError) {
      log.error(
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
  const config = await storage.sync.get('config');
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

export async function importStylesheet(
  id: string,
  href: string
): Promise<HTMLStyleElement> {
  const styleElement = document.getElementById(id) as HTMLStyleElement | null;
  if (styleElement) return styleElement;

  // Fetch the CSS file content
  const response = await fetch(href);
  const css = await response.text();

  // Create a <style> element with the CSS content
  let style = document.createElement('style');
  style.id = id;
  style.textContent = css;

  // Append the <style> element to the <head>
  getBalloonContainer().appendChild(style);
  return style;
}

export async function askOriginPermissions() {
  const host_permissions = await browser.runtime.getManifest().host_permissions;
  if (!host_permissions) return log.error('No host_permissions found');
  const permissions = await browser.permissions.request({
    origins: host_permissions,
  });
  log.debug('Permissions granted for', permissions);
}

export function isFullScreenVideoPlaying() {
  const fullscreenElement = document.fullscreenElement;
  if (fullscreenElement) {
    if (fullscreenElement.tagName.toLowerCase() === 'video') {
      return true;
    }
    const videos = [
      ...fullscreenElement.getElementsByTagName('video'),
      ...document.getElementsByTagName('video'),
    ];
    if (videos.length > 0) {
      return true;
    }
  }
  return false;
}

export async function isInSnooze(): Promise<boolean> {
  const snooze = await storage.sync.get('snooze');
  return snooze !== null && (snooze === -1 || Date.now() < snooze);
}

export function joinPaths(...paths: string[]): string {
  return paths
    .map((part, index) => {
      if (index === 0) {
        return part.trim().replace(/[/]*$/g, '');
      } else {
        return part.trim().replace(/(^[/]*|[/]*$)/g, '');
      }
    })
    .filter((part) => part.length)
    .join('/');
}
