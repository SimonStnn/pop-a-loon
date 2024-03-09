import { abbreviateNumber } from 'js-abbreviation-number';
import { Message } from '../const';
import storage from '../storage';
import { generateRandomNumber, minutesToMilliseconds, sleep } from '../utils';

const resetCounter = () => {
  storage.set('balloonCount', { balloonCount: 0 });
  setBadgeNumber(0);
};

const setBadgeNumber = (count: number) => {
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
        setBadgeNumber(message.balloonCount);
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

  setBadgeNumber(balloonCount || 0);
  updateBadgeColors();

  let i = 0;
  while (true) {
    await sleep(generateRandomNumber(0, minutesToMilliseconds(10)));
    chrome.tabs.query({ active: true }, (tabs) => {
      const num = Math.round(generateRandomNumber(0, tabs.length - 1));
      const tab = tabs[num];
      if (!tab.id) return;
      console.log(`Sending spawnBalloon to`, tab);

      chrome.tabs.sendMessage(
        tab.id,
        { action: 'spawnBalloon' },
        (response) => {
          if (chrome.runtime.lastError) {
            chrome.runtime.lastError = undefined;
          }
        }
      );
    });
  }
});

(async () => {
  if (typeof window !== 'undefined') return;
})();
