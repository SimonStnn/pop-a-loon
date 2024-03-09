import Balloon, { balloonContainer } from '../balloon';
import { Message } from '../const';
import './style.css';

(() => {
  // Prevent multiple script loads
  if (
    document.body.id === 'pop-a-loon' ||
    document.body.contains(balloonContainer)
  ) {
    return;
  }

  chrome.runtime.onMessage.addListener(
    async (message: Message, sender, sendResponse) => {
      sendResponse();
      console.log('message', message);
      if (message.action !== 'spawnBalloon') return;
      const balloon = new Balloon();
      balloon.rise();
    }
  );

  document.body.appendChild(balloonContainer);
})();
