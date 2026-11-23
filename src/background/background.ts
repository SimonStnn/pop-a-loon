import { abbreviateNumber } from 'js-abbreviation-number';
import browser from 'webextension-polyfill';
import { AlarmName, Message, SpawnSchedule, initalConfig } from '@/const';
import log, { type LogLevelNames } from '@/managers/log';
import storage from '@/managers/storage';
import remote from '@/remote';
import {
  random,
  getBrowser,
  isRunningInBackground,
  isInSnooze,
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

    // Ask the backend when the next balloon should spawn and arm the alarm
    await scheduleNext();

    // Set badge number and colors
    setBadgeNumber(user.count || 0);
    updateBadgeColors();

    log.debug('Setup complete');
  };

  const getSchedule = async () => await storage.local.get('spawnSchedule');

  const fetchSchedule = async (): Promise<SpawnSchedule> => {
    try {
      const requestedAt = Date.now();
      const data = await remote.getSpawnToken();
      const receivedAt = Date.now();

      // spawnAt/expiresAt are server-clock timestamps, but browser alarms run
      // on the local clock. Estimate the offset assuming request and response
      // took about the same time: the server clock at receipt was roughly
      // serverTime + half the round trip.
      const clockOffset =
        typeof data.serverTime === 'number'
          ? data.serverTime - (requestedAt + receivedAt) / 2
          : 0;
      if (clockOffset) {
        log.debug(' - Correcting server clock skew', clockOffset, 'ms');
      }

      const schedule: SpawnSchedule = {
        ...data,
        spawnAt: data.spawnAt - clockOffset,
        expiresAt: data.expiresAt - clockOffset,
        spawned: false,
      };
      await storage.local.set('spawnSchedule', schedule);
      return schedule;
    } catch (e) {
      // Backend without spawn-token support: fall back to a local schedule and
      // spawn without a token, exactly like the pre-token extension did.
      log.debug(
        ' - Backend does not support spawn tokens, using local schedule'
      );
      const config = await storage.sync.get('config');
      const spawnRateMultiplier = Math.max(0, Math.min(config.spawnRate, 1));
      const delay =
        random(config.spawnInterval.min, config.spawnInterval.max) /
        spawnRateMultiplier;
      const spawnAt = Date.now() + delay;
      const schedule: SpawnSchedule = {
        spawnToken: '',
        balloonType: 'default',
        spawnAt,
        expiresAt: spawnAt + 30 * 1000,
        spawned: false,
      };
      await storage.local.set('spawnSchedule', schedule);
      return schedule;
    }
  };

  const clearSchedule = async () => {
    await storage.local.remove('spawnSchedule');
  };

  const spawnBalloon = async (schedule: SpawnSchedule) => {
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

    // Never inject a token that has already expired. Otherwise a balloon can
    // be on screen while every pop is guaranteed to be rejected server-side.
    if (now >= schedule.expiresAt)
      return skipSpawnMessage('spawn token already expired');
    log.debug(' - Spawn token still valid');

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

    if (await isInSnooze()) return skipSpawnMessage('In snooze');
    log.debug(' - Not in snooze');

    // Check if the browser is idle
    const state = await browser.idle.queryState(5 * 60);
    if (state !== 'active') return skipSpawnMessage('Browser is idle');
    log.debug(' - Browser is not idle');

    // Get all active tabs
    const tabs = await browser.tabs.query({ active: true });
    // Select a random tab
    const num = Math.round(random(0, tabs.length - 1));
    const tab = tabs[num];
    if (!tab.id) return skipSpawnMessage('No tab id', 'warn');
    log.debug(' - Selected tab', tab.id);

    try {
      // Inject the scheduled token as a global before the content script
      // runs, avoiding a race between executeScript and tabs.sendMessage
      if (schedule.spawnToken) {
        await browser.scripting.executeScript({
          target: { tabId: tab.id },
          func: (token: string, balloonType: string) => {
            (window as any).__SPAWN_TOKEN__ = { token, balloonType };
          },
          args: [schedule.spawnToken, schedule.balloonType],
        });
      }

      // Execute content script on tab
      await browser.scripting.executeScript({
        files: ['spawn-balloon.js'],
        target: { tabId: tab.id },
      });

      log.info(' - Successfully sent spawn balloon script to tab', tab.id);

      // Mark this schedule as spawned so the same balloon is not spawned twice.
      schedule.spawned = true;
      await storage.local.set('spawnSchedule', schedule);
    } catch (e) {
      log.softerror(' - Error sending spawn balloon script to tab', tab.id, e);
    }
    // Base the "too recent" guard on the scheduled time rather than wall time
    // so a server-chosen minimum interval cannot trip it.
    lastSpawn = schedule.spawnAt;
    log.timeEnd('debug', 'Spawn Time');
    log.groupEnd('debug');
  };

  let scheduling = false;
  const syncSchedule = async (forceRefresh = false) => {
    if (scheduling) return;
    scheduling = true;
    try {
      let schedule = forceRefresh ? undefined : await getSchedule();
      const now = Date.now();

      // No schedule yet, or the previous one expired without being popped.
      // A missed balloon must never be re-spawned with an expired token.
      if (!schedule || now >= schedule.expiresAt) {
        await browser.alarms.clear('spawnBalloon');
        schedule = await fetchSchedule();
      }

      if (!schedule.spawned) {
        if (now >= schedule.spawnAt) {
          // The backend-chosen spawn time has arrived.
          await spawnBalloon(schedule);
        } else {
          // Arm the alarm for the backend-chosen spawn time.
          await browser.alarms.create('spawnBalloon', {
            when: schedule.spawnAt,
          });
        }
      }

      // If the balloon is never popped, fetch a fresh schedule on expiry.
      await browser.alarms.create('refreshSpawnToken', {
        when: schedule.expiresAt,
      });
    } finally {
      scheduling = false;
    }
  };
  const scheduleNext = () => syncSchedule();
  const refreshSchedule = () => syncSchedule(true);

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
        await scheduleNext();
        break;
      case 'refreshSpawnToken':
        // The previous balloon was never popped. Replace its schedule; do not
        // try to spawn it again, its token may already be expired.
        await refreshSchedule();
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
        try {
          // Increment the count and save it to the local storage
          const newCount = await remote.incrementCount(
            message.type,
            message.spawnToken
          );
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

          // The token was consumed server-side; schedule the next balloon.
          await clearSchedule();
          await scheduleNext();
        } catch (e) {
          // The pop was not accepted (e.g. the token expired). Drop the stale
          // schedule so the next balloon is issued with a valid token.
          log.softerror('Failed to increment count:', e);
          await clearSchedule();
          await refreshSchedule();
        }
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
