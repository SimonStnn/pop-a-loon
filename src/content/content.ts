import browser from 'webextension-polyfill';
import { Message } from '@const';
import { balloonContainer } from '@/balloon';
import { sendMessage, weightedRandom } from '@/utils';
import * as balloons from '@/balloons';
import './style.css';

(() => {
  if (
    // Prevent running in popup
    document.body.id === 'pop-a-loon' ||
    // Prevent multiple script loads
    document.body.contains(balloonContainer)
  ) {
    return;
  }

  let secret: string | undefined;
  browser.runtime.onMessage.addListener(
    async (message: Message, sender, sendResponse) => {
      if (message.action === 'setSecret' && message.secret === undefined) {
        secret = message.secret;
      }
    }
  );
  sendMessage({ action: 'getSecret' });

  browser.runtime.onMessage.addListener(
    async (message: Message, sender, sendResponse) => {
      // Always call sendResponse, this is required
      sendResponse();
      // If the message is not spawnBalloon, ignore it
      if (message.action !== 'spawnBalloon') return;

      const balloonClasses = Object.values(balloons);
      // Make a list from the spawn_chance from each balloon class
      const spawnChances = balloonClasses.map(
        (BalloonType) => BalloonType.spawn_chance
      );

      // Create a new balloon and make it rise
      const Balloon =
        weightedRandom(balloonClasses, spawnChances) || balloons.Default;
      const balloon = new Balloon();
      balloon.rise();
    }
  );

  document.body.appendChild(balloonContainer);
})();
