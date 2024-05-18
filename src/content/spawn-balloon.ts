import * as balloons from '@/balloons';
import { getBalloonContainer, weightedRandom } from '@/utils';
import './style.css';

(() => {
  // Prevent running in popup
  if (document.body.id === 'pop-a-loon') return;

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
})();
