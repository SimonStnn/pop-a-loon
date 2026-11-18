import * as balloons from '@/balloons';
import log from '@/managers/log';
import storage from '@/managers/storage';
import {
  getBalloonContainer,
  importStylesheet,
  isFullScreenVideoPlaying,
  weightedRandom,
} from '@/utils';
import { isInSeason } from '@/utils';

// Spawn token injected as a global by the background script before this
// file runs. Absent when the backend doesn't support spawn tokens.
const spawnTokenData = (window as any).__SPAWN_TOKEN__ as
  | {
      token: string;
      balloonType: string;
    }
  | undefined;

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

  // Add the balloon container to the document
  const _ = getBalloonContainer();

  let Balloon: any;

  if (spawnTokenData?.balloonType) {
    // Use the backend-chosen balloon type from the spawn token
    const balloonName = spawnTokenData.balloonType as keyof typeof balloons;
    Balloon = balloons[balloonName];
  }

  // Fallback: weighted random selection (legacy mode or invalid balloonType)
  if (!Balloon) {
    const balloonClasses = Object.values(balloons).filter((BalloonType) => {
      const season = BalloonType.season;
      return (
        !season || process.env.NODE_ENV === 'development' || isInSeason(season)
      );
    });
    const spawnChances = balloonClasses.map(
      (BalloonType) => BalloonType.spawn_chance
    );
    Balloon = weightedRandom(balloonClasses, spawnChances, {
      default: balloons.Default,
    });
  }

  const balloon = new Balloon();
  balloon.spawnToken = spawnTokenData?.token ?? undefined;
  balloon.rise();

  log.debug('Balloon spawned:', balloon.name);

  log.timeEnd('debug', 'Balloon spawn time');
  log.groupEnd('debug');
})();
