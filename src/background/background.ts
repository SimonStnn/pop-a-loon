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

const setup = async () => {
  const balloonCount = (await storage.get('balloonCount'))?.balloonCount;
  // Reset the counter if it's undefined
  if (balloonCount === undefined) {
    resetCounter();
  }

  // Set badge number and colors
  setBadgeNumber(balloonCount || 0);
  updateBadgeColors();
};

let loopRunning = false;
const loop = async () => {
  // If the loop is already running, don't start another one
  if (loopRunning) return;
  loopRunning = true;

  while (true) {
    // Wait between 0 and 10 minutes
    await sleep(generateRandomNumber(0, minutesToMilliseconds(10)));

    // Get all active tabs
    chrome.tabs.query({ active: true }, (tabs) => {
      // Select a random tab
      const num = Math.round(generateRandomNumber(0, tabs.length - 1));
      const tab = tabs[num];
      if (!tab.id) return;
      console.log(`Sending spawnBalloon to`, tab);

      // Send the spawnBalloon message
      chrome.tabs.sendMessage(
        tab.id,
        { action: 'spawnBalloon' },
        (response) => {
          // If there was an error, discard it
          // Error is most likely 'Receiving end does not exist.' exception
          if (chrome.runtime.lastError) {
            chrome.runtime.lastError = undefined;
          }
        }
      );
    });
  }
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

chrome.runtime.onStartup.addListener(async () => {
  await setup();
  await loop();
});

chrome.runtime.onInstalled.addListener(async () => {
  await setup();
  await loop();
});
