import browser from 'webextension-polyfill';
import { abbreviateNumber } from 'js-abbreviation-number';
import { AlarmName, Message, initalConfig } from '@const';
import { generateRandomNumber, getBrowser, sendMessage, sleep } from '@utils';
import storage from '@/storage';
import remote from '@/remote';

const setBadgeNumber = (count: number) => {
  browser.action.setBadgeText({
    text: abbreviateNumber(count),
  });
};

const updateBadgeColors = () => {
  (async () => {
    const config = await storage.get('config');
    browser.action.setBadgeBackgroundColor({
      color: config.badge.backgroundColor,
    });
    browser.action.setBadgeTextColor({ color: config.badge.color });
  })();
};

(() => {
  const rapidSpawnPenalty = 5 * 60 * 1000; // 5 minutes
  let lastSpawn: number;
  let spawnTimeout: number | null = null;

  const setup = async () => {
    // Clear all alarms
    await browser.alarms.clearAll();

    //! Fix for #145
    try {
      console.log('Checking for depricated balloonCount');
      await storage.remove('balloonCount' as any);
    } catch (e) {}

    const remoteAvailable = await remote.isAvailable();
    if (!remoteAvailable) {
      console.log('Remote is not available, retrying in 1 minute');
      await browser.alarms.create('restart', { when: Date.now() + 60000 });
      return;
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
    const skipSpawnMessage = (note: any, level: 'log' | 'warn' = 'warn') =>
      console[level](`Skipping spawnBalloon message: \r\n\t`, note);

    // Check if there is a spawn timeout
    if (spawnTimeout !== null && Date.now() < spawnTimeout)
      return skipSpawnMessage('balloon spawn in timeout');

    // Check if the last spawn was too recent
    if (
      lastSpawn &&
      Date.now() - lastSpawn < (await storage.get('config')).spawnInterval.min
    ) {
      spawnTimeout = Date.now() + rapidSpawnPenalty;
      return skipSpawnMessage('Spawned too recently, setting timeout');
    }

    // Get all active tabs
    const tabs = await browser.tabs.query({ active: true });
    // Select a random tab
    const num = Math.round(generateRandomNumber(0, tabs.length - 1));
    const tab = tabs[num];
    if (!tab.id) return skipSpawnMessage('No tab id');

    // Check if the browser is idle
    const state = await browser.idle.queryState(5 * 60);
    if (state !== 'active') return skipSpawnMessage('Browser is idle', 'log');

    // Check if no spawn alarms are already set
    const alarms = await browser.alarms.getAll();
    if (alarms.some((alarm) => alarm.name === 'spawnBalloon'))
      return skipSpawnMessage('Spawn alarm already set');
    console.log(`Sending spawnBalloon message`);

    lastSpawn = Date.now();
    // Send the spawnBalloon message
    const response = await browser.tabs
      .sendMessage(tab.id, { action: 'spawnBalloon' })
      .catch((e) => {});
    if (browser.runtime.lastError) {
      browser.runtime.lastError;
    }
  };

  const createSpawnAlarm = async (name: AlarmName) => {
    const config = await storage.get('config');
    // Generate a random delay between the min and max spawn interval
    const randomDelay = generateRandomNumber(
      config.spawnInterval.min,
      config.spawnInterval.max
    );
    await browser.alarms.create(name, { when: Date.now() + randomDelay });
  };

  let backgroundScriptRunning = false;
  const backgroundScript = async () => {
    if (backgroundScriptRunning) return;
    backgroundScriptRunning = true;
    try {
      // If extension is being run in firefox, set the browserAction popup
      if (getBrowser() === 'Firefox' && !('action' in browser)) {
        (browser as any).action = (browser as any).browserAction;
      }

      await setup();
    } catch (e) {
      console.error(e);
      console.log('Restarting in 1 minute');
      browser.alarms.create('restart', { when: Date.now() + 60000 });
    }
  };

  browser.alarms.onAlarm.addListener(async (alarm) => {
    switch (alarm.name as AlarmName) {
      case 'spawnBalloon':
        // Spawn a balloon
        await spawnBalloon();
        // Create a new alarm for the spawn interval
        await createSpawnAlarm('spawnBalloon');
        break;
      case 'restart':
        // Restart the extension
        browser.runtime.reload();
        break;
    }
  });

  browser.runtime.onMessage.addListener(async function messageListener(
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

        const msg: Message = {
          action: 'updateCounter',
          balloonCount: newCount.count,
        };
        // Send message to popup if its open
        sendMessage(msg);
        // Call the listener again to update the badge number
        messageListener(msg, sender, sendResponse);
        break;
    }
  });

  browser.runtime.onStartup.addListener(backgroundScript);
  browser.runtime.onInstalled.addListener(backgroundScript);
  setTimeout(backgroundScript, 500);
})();
