import browser from 'webextension-polyfill';
import { Message } from '@const';
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
    return res;
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

export function weightedRandom<T>(results: T[], weights: number[]): T | null {
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

  // Return null if no result is found (shouldn't happen if the weights are correct)
  return null;
}
