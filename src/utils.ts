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

export function sendMessage(message: Message) {
  try {
    chrome.runtime.sendMessage(message);
  } catch (e) {}
}
