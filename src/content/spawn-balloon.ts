import browser from 'webextension-polyfill';
import * as balloons from '@/balloons';
import {
  getBalloonContainer,
  importStylesheet,
  isFullScreenVideoPlaying,
  weightedRandom,
} from '@/utils';
import log from '@/managers/log';
import storage from '@/managers/storage';

(async () => {
  // Prevent running in popup
  if (document.body.id === 'pop-a-loon') return;

  const config = await storage.sync.get('config');

  // Run checks to see if the balloon should spawn
  if (!config.fullScreenVideoSpawn && isFullScreenVideoPlaying()) {
    log.debug('Full screen video playing, not spawning balloon');
    return;
  }

  log.setLevel((await storage.local.get('loglevel')) || 'info');
  log.groupCollapsed('debug', 'Pop-a-loon: Spawning balloon');
  log.time('debug', 'Balloon spawn time');

  importStylesheet(
    'balloon-styles',
    browser.runtime.getURL('resources/stylesheets/style.css')
  );

  // Add the balloon container to the document
  const _ = getBalloonContainer();

  const balloonClasses = Object.values(balloons);
  // Make a list from the spawn_chance from each balloon class
  const spawnChances = balloonClasses.map(
    (BalloonType) => BalloonType.spawn_chance
  );

  // Create a new balloon and make it rise
  const Balloon = weightedRandom(balloonClasses, spawnChances, {
    default: balloons.Default,
  });

  const balloon = new Balloon();
  balloon.rise();

  log.debug('Balloon spawned:', balloon.name);

  log.timeEnd('debug', 'Balloon spawn time');
  log.groupEnd('debug');
})();
