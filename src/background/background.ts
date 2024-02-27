import { abbreviateNumber } from 'js-abbreviation-number';
import { Message } from '../const';
import { storage, sendMessage } from '../utils';

const resetCounter = () => {
  storage.set('balloonCount', { balloonCount: 0 });
  chrome.action.setBadgeText({ text: '0' });
};

const setBadgeText = (count: number) => {
  chrome.action.setBadgeText({
    text: abbreviateNumber(count),
  });
};

const updateBadgeColors = () => {
  chrome.action.setBadgeBackgroundColor({ color: '#7aa5eb' });
  chrome.action.setBadgeTextColor({ color: '#26282b' });
};

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    switch (message.action) {
      case 'resetCounter':
        resetCounter();
        break;
      case 'updateCounter':
        setBadgeText(message.balloonCount);
        updateBadgeColors();
        break;
    }
  }
);

chrome.runtime.onInstalled.addListener(async () => {
  const balloonCount = (await storage.get('balloonCount'))?.balloonCount;
  if (balloonCount === undefined) {
    resetCounter();
  }
});
