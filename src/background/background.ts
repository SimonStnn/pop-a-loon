import { abbreviateNumber } from 'js-abbreviation-number';
import { AlarmName, Message, initalConfig } from '@const';
import { generateRandomNumber, sendMessage, sleep } from '@utils';
import storage from '@/storage';
import remote from '@/remote';

const setBadgeNumber = (count: number) => {
  chrome.action.setBadgeText({
    text: abbreviateNumber(count),
  });
};

const updateBadgeColors = () => {
  (async () => {
    const config = await storage.get('config');
    chrome.action.setBadgeBackgroundColor({
      color: config.badge.backgroundColor,
    });
    chrome.action.setBadgeTextColor({ color: config.badge.color });
  })();
};

(() => {
  // Check if the script is running in the background
  // If the window object exists, we're not in the background script
  if (typeof window !== 'undefined') return;

  const setup = async () => {
    const remoteAvailable = await remote.isAvailable();
    if (!remoteAvailable) {
      console.log('Remote is not available, retrying in 1 minute');
      chrome.alarms.create('restart', { when: Date.now() + 60000 });
    }

    // Get the user from the local storage
    let localUser = await storage.get('user');
    // If the user is not in the local storage, get a new user from the remote
    if (!localUser) {
      const usr = await remote.NewUser('Anonymous');
      await storage.set('token', usr.token);
      localUser = usr;
    }
    // Get the user from the remote and save it to the local storage
    const user = await remote.getUser(localUser.id);
    await storage.set('user', user);

    // Get the config from the remote
    const remoteConfig = await remote.getConfiguration();
    // Get the config from the local storage
    const config = (await storage.get('config')) || initalConfig;
    // Merge the local config with the remote config
    await storage.set('config', { ...config, ...remoteConfig });

    // Create the alarm for the spawn interval
    createSpawnAlarm('spawnBalloon');

    // Set badge number and colors
    setBadgeNumber(user.count || 0);
    updateBadgeColors();
  };

  const spawnBalloon = async () => {
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
  };

  const createSpawnAlarm = async (name: AlarmName) => {
    const config = await storage.get('config');
    // Generate a random delay between the min and max spawn interval
    const randomDelay = generateRandomNumber(
      config.spawnInterval.min,
      config.spawnInterval.max
    );
    chrome.alarms.create(name, { when: Date.now() + randomDelay });
  };

  const backgroundScript = async () => {
    try {
      await setup();
    } catch (e) {
      console.error(e);
      console.log('Restarting in 1 minute');
      chrome.alarms.create('restart', { when: Date.now() + 60000 });
    }
  };

  chrome.alarms.onAlarm.addListener(async (alarm) => {
    switch (alarm.name as AlarmName) {
      case 'spawnBalloon':
        // Spawn a balloon
        await spawnBalloon();
        // Create a new alarm for the spawn interval
        await createSpawnAlarm('spawnBalloon');
        break;
      case 'restart':
        // Restart the extension
        chrome.runtime.reload();
        break;
    }
  });

  chrome.runtime.onMessage.addListener(async function messageListener(
    message: Message,
    sender,
    sendResponse
  ) {
    switch (message.action) {
      case 'updateCounter':
        setBadgeNumber(message.balloonCount);
        updateBadgeColors();
        break;
      case 'incrementCount':
        // Increment the count and save it to the local storage
        const newCount = await remote.incrementCount();
        storage.set('user', {
          ...(await storage.get('user')),
          count: newCount.count,
        });
        // Send message to popup if its open
        sendMessage({
          action: 'updateCounter',
          balloonCount: newCount.count,
        });
        // Call the listener again to update the badge number
        messageListener(
          { action: 'updateCounter', balloonCount: newCount.count },
          sender,
          sendResponse
        );
        break;
    }
  });

  chrome.runtime.onStartup.addListener(backgroundScript);
  chrome.runtime.onInstalled.addListener(backgroundScript);
})();
