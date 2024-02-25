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

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    switch (message.action) {
      case 'resetCounter':
        resetCounter();
        break;
      case 'updateCounter':
        setBadgeText(message.balloonCount);
        break;
    }
  }
);

(async () => {
  if (typeof window !== 'undefined') return;

  let balloonCount = (await storage.get('balloonCount'))?.balloonCount;

  if (balloonCount === undefined) {
    resetCounter();
    balloonCount = 0;
  }
  chrome.action.setBadgeBackgroundColor({ color: '#7aa5eb' });
  chrome.action.setBadgeTextColor({ color: '#26282b' });
  setBadgeText(balloonCount);
})();
