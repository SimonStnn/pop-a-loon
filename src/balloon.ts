import { generateRandomNumber, sendMessage, storage } from './utils';
import { balloonImageUrl, popSoundUrl } from './const';

export const balloonContainer = document.createElement('div');
balloonContainer.id = 'balloon-container';

export default class Balloon {
  private element: HTMLDivElement = document.createElement('div');
  private duration: number;
  private popSound: HTMLAudioElement = new Audio(popSoundUrl);

  constructor() {
    // Set the balloon's width and height to value between 50 and 200
    this.element.classList.add('balloon');
    const size = generateRandomNumber(50, 75);
    this.element.style.width = size + 'px';
    this.element.style.height = size + 'px';
    this.element.style.left = `calc(${generateRandomNumber(5, 95) + 'vw'} - ${
      size / 2
    }px)`;
    const image = document.createElement('img');
    image.src = balloonImageUrl;
    this.element.appendChild(image);

    // Add the balloon to the page
    balloonContainer.appendChild(this.element);

    this.duration = generateRandomNumber(10000, 15000);

    // Add an event listener to the balloon
    this.element.addEventListener('click', this.pop.bind(this));
  }

  public isRising() {
    return this.element.style.animationName === 'rise';
  }

  public rise() {
    this.element.style.animation = `rise ${this.duration}ms linear`;

    setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  public remove() {
    this.element.remove();
  }

  public async pop() {
    // Remove the balloon
    this.remove();
    // Play the pop sound
    this.popSound.play();

    // Get the stored value
    const storedCount = (await storage.get('balloonCount')).balloonCount || 0;
    const balloonCount = storedCount + 1;
    // Store the new value
    storage.set('balloonCount', { balloonCount });
    // Send message with the new count
    sendMessage({ action: 'updateCounter', balloonCount });
  }
}
