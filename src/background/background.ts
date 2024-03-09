import { abbreviateNumber } from 'js-abbreviation-number';
import { Message } from '../const';
import storage from '../storage';
import { sleep } from '../utils';

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
    await sleep(1000);
    chrome.tabs.query({ active: true }, (tabs) => {
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        if (!tab.id) continue;
        console.log(`Sending to`, tab, tab.url, tab.pendingUrl);

        chrome.tabs.sendMessage(
          tab.id,
          { action: 'spawnBalloon' },
          (response) => {
            if (chrome.runtime.lastError) {
              chrome.runtime.lastError = undefined;
            }
          }
        );
      }
    });
  }
});

(async () => {
  if (typeof window !== 'undefined') return;
})();
