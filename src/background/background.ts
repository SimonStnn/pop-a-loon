import { Message } from '../const';
import { storage, sendMessage } from '../utils';

const resetCounter = () => {
  storage.set('balloonCount', { balloonCount: 0 });
  chrome.action.setBadgeText({ text: '0' });
};

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    switch (message.action) {
      case 'resetCounter':
        resetCounter();
        break;
      case 'updateCounter':
        chrome.action.setBadgeText({
          text: message.balloonCount.toString(),
        });
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

  chrome.action.setBadgeText({
    text: balloonCount.toString(),
  });
})();
