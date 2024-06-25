import browser from 'webextension-polyfill';
import { abbreviateNumber } from 'js-abbreviation-number';
import storage from '@/managers/storage';
import log, { type LogLevelNames } from '@/managers/log';
import remote from '@/remote';
import { AlarmName, Message, initalConfig } from '@/const';
import {
  calculateBalloonSpawnDelay,
  random,
  getBrowser,
  isRunningInBackground,
  sendMessage,
} from '@/utils';

console.log(
  "%cIf someone told you to copy/paste something here you have an 11/10 chance you're being scammed.",
  'font-size:18px; color: red; font-weight: bold; padding: 25px 10px;'
);

const setBadgeNumber = (count: number) => {
  browser.action.setBadgeText({
    text: abbreviateNumber(count),
  });
};

const updateBadgeColors = () => {
  (async () => {
    const config = await storage.sync.get('config');
    browser.action.setBadgeBackgroundColor({
      color: config.badge.backgroundColor,
    });
    browser.action.setBadgeTextColor({ color: config.badge.color });
  })();
};

(() => {
  // Check if the background script is running in the background
  if (!isRunningInBackground()) return;

  if (process.env.NODE_ENV === 'development') log.setLevel('debug');
  else log.setLevel('info');

  const rapidSpawnPenalty = 5 * 60 * 1000; // 5 minutes
  let lastSpawn: number;
  let spawnTimeout: number | null = null;

  const setup = async () => {
    log.info('Pop-a-loon version:', process.env.npm_package_version);
    log.debug(`Mode: ${process.env.NODE_ENV}`);
    log.debug('Browser:', getBrowser());
    log.debug('Running in background:', isRunningInBackground());
    log.debug(
      'Logging level:',
      log.toLogLevelName(log.getLevel()),
      '(',
      log.getLevel(),
      ')'
    );
    log.debug('');

    // Clear all alarms
    await browser.alarms.clearAll();

    //! Fix for #145
    try {
      log.debug('Checking for depricated balloonCount');
      await storage.sync.remove('balloonCount' as any);
    } catch (e) {}

    const remoteAvailable = await remote.isAvailable();
    if (!remoteAvailable) {
      log.warn('Remote is not available, retrying in 1 minute');
      await browser.alarms.create('restart', { when: Date.now() + 60000 });
      return;
    }

    // Get the user from the local storage
    let localUser = await storage.sync.get('user');
    // If the user is not in the local storage, get a new user from the remote
    if (!localUser) {
      const usr = await remote.NewUser();
      await storage.sync.set('token', usr.token);
      localUser = usr;
    }
    // Get the user from the remote and save it to the local storage
    const user = await remote.getUser(localUser.id);
    await storage.sync.set('user', user);

    // Get the config from the remote
    const remoteConfig = await remote.getConfiguration();
    // Get the config from the local storage
    const config = (await storage.sync.get('config')) || initalConfig;
    // Merge the local config with the remote config
    await storage.sync.set('config', {
      ...initalConfig,
      ...config, // config overrides the initial config
      ...remoteConfig, // remoteConfig overrides the config
    });

    // Create the alarm for the spawn interval
    createSpawnAlarm('spawnBalloon');

    // Set badge number and colors
    setBadgeNumber(user.count || 0);
    updateBadgeColors();

    log.debug('Setup complete');
  };

  const spawnBalloon = async () => {
    log.groupCollapsed(
      'debug',
      `(${new Date().toLocaleTimeString()}) Spawning Balloon...`
    );
    log.time('debug', 'Spawn Time');

    const now = Date.now();
    const minSpawnInterval = (await storage.sync.get('config')).spawnInterval
      .min;
    const skipSpawnMessage = (note: any, level: LogLevelNames = 'softwarn') => {
      log[level](`Skipping spawnBalloon message: \r\n\t`, note);
      log.timeEnd('debug', 'Spawn Time');
      log.groupEnd('debug');
    };

    // Check if there is a spawn timeout
    if (spawnTimeout !== null && Date.now() < spawnTimeout)
      return skipSpawnMessage('balloon spawn in timeout');
    log.debug(' - No spawn timeout');

    // Check if the last spawn was too recent
    if (lastSpawn && now - lastSpawn < minSpawnInterval) {
      spawnTimeout = now + rapidSpawnPenalty;
      return skipSpawnMessage('Spawned too recently, setting timeout');
    }
    log.debug(' - Last spawn was not too recent');

    // Check if the browser is idle
    const state = await browser.idle.queryState(5 * 60);
    if (state !== 'active') return skipSpawnMessage('Browser is idle');
    log.debug(' - Browser is not idle');

    // Check if no spawn alarms are already set
    const alarms = await browser.alarms.getAll();
    if (alarms.some((alarm) => alarm.name === 'spawnBalloon'))
      return skipSpawnMessage('Spawn alarm already set');
    log.debug(' - No spawn alarm already set');

    // Get all active tabs
    const tabs = await browser.tabs.query({ active: true });
    // Select a random tab
    const num = Math.round(random(0, tabs.length - 1));
    const tab = tabs[num];
    if (!tab.id) return skipSpawnMessage('No tab id', 'warn');
    log.debug(' - Selected tab', tab.id);

    try {
      // Execute content script on tab
      await browser.scripting.executeScript({
        files: ['spawn-balloon.js'],
        target: { tabId: tab.id },
      });
      log.info(' - Successfully sent spawn balloon script to tab', tab.id);
    } catch (e) {
      log.softerror(' - Error sending spawn balloon script to tab', tab.id, e);
    }
    lastSpawn = now;
    log.timeEnd('debug', 'Spawn Time');
    log.groupEnd('debug');
  };

  const createSpawnAlarm = async (name: AlarmName) => {
    await browser.alarms.create(name, {
      when: Date.now() + (await calculateBalloonSpawnDelay()),
    });
  };

  let backgroundScriptRunning = false;
  const backgroundScript = async () => {
    if (backgroundScriptRunning) return;
    backgroundScriptRunning = true;
    try {
      // If extension is being run in firefox, set the browserAction popup
      if (getBrowser() === 'Firefox' && !('action' in browser)) {
        log.debug('Setting browser action to browser.browserAction');
        (browser as any).action = (browser as any).browserAction;
      }

      await setup();
    } catch (e) {
      log.error(e);
      log.info('Restarting in 1 minute');
      browser.alarms.create('restart', { when: Date.now() + 60000 });
    }
  };

  browser.alarms.onAlarm.addListener(async (alarm) => {
    log.debug('Alarm triggered', alarm.name);
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
    log.debug('Message received:', message);
    switch (message.action) {
      case 'updateCounter':
        setBadgeNumber(message.balloonCount);
        updateBadgeColors();
        break;
      case 'incrementCount':
        // Increment the count and save it to the local storage
        const newCount = await remote.incrementCount(message.type);
        storage.sync.set('user', {
          ...(await storage.sync.get('user')),
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
      case 'setLogLevel':
        log.setLevel(message.level);
        break;
    }
  });

  browser.runtime.onStartup.addListener(backgroundScript);
  browser.runtime.onInstalled.addListener(backgroundScript);
  setTimeout(backgroundScript, 500);
})();
