import * as balloons from '@/balloons';
import log from '@/managers/log';
import storage from '@/managers/storage';
import { getBalloonClass } from '@/resolve-balloon';
import {
  getBalloonContainer,
  importStylesheet,
  isFullScreenVideoPlaying,
  sendMessage,
  weightedRandom,
} from '@/utils';
import { isInSeason } from '@/utils';
import type { SpawnTokenMessageResponse } from '@/const';

(async () => {
  // Prevent running in popup
  if (document.body.id === 'pop-a-loon') return;

  // Request the one-time token over the extension message channel. It is
  // scoped to this tab and cleared after this call, and is never placed on
  // `window` where a host-page script could read it.
  const spawnTokenData = (await sendMessage({
    action: 'getSpawnToken',
  })) as SpawnTokenMessageResponse | undefined;

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

  let Balloon: ReturnType<typeof getBalloonClass>;

  if (spawnTokenData?.balloonType) {
    // The backend records the pop under the type bound to the spawn token, so
    // render that exact type instead of picking another one locally.
    Balloon = getBalloonClass(spawnTokenData.balloonType);
    if (!Balloon) {
      log.warn(
        ' - Unknown balloonType from backend:',
        spawnTokenData.balloonType
      );
      // A locally chosen balloon would be counted under the backend's type,
      // so skip this spawn rather than show a balloon that pops incorrectly.
      log.timeEnd('debug', 'Balloon spawn time');
      log.groupEnd('debug');
      return;
    }
  } else {
    // Fallback: weighted random selection when no token was issued (dev mode).
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
  balloon.spawnToken = spawnTokenData?.spawnToken ?? undefined;
  balloon.rise();

  log.debug('Balloon spawned:', balloon.name);

  log.timeEnd('debug', 'Balloon spawn time');
  log.groupEnd('debug');
})();
