import { generateRandomNumber, sendMessage } from '@utils';
import * as balloons from '@/balloons';

export const balloonContainer = document.createElement('div');
balloonContainer.id = 'balloon-container';

class HTMLBalloonElement extends HTMLDivElement {
  private _size: number = 50;

  constructor() {
    super();
    this.classList.add('balloon');
    this.appendChild(document.createElement('img'));

    // Add the balloon to the page
    balloonContainer.appendChild(this);
  }

  get size(): number {
    return this._size;
  }
  set size(value: number) {
    this._size = value;
    this.style.width = value + 'px';
    this.style.height = value + 'px';
    this.style.left = `calc(${generateRandomNumber(5, 95) + 'vw'} - ${
      value / 2
    }px)`;
  }

  get image(): HTMLImageElement {
    return this.querySelector('img') as HTMLImageElement;
  }

  public isRising() {
    return this.style.animationName === 'rise';
  }

  public rise(duration: number) {
    this.style.animation = `rise ${duration}ms linear`;
    setTimeout(() => {
      this.remove();
    }, duration);
  }
}

export default abstract class Balloon {
  protected abstract balloonImageUrl: string;
  protected abstract popSound: HTMLAudioElement;
  public abstract getRandomDuration(): number;

  private element: HTMLBalloonElement = new HTMLBalloonElement();

  constructor() {
    // Set the balloon's width and height to value between 50 and 200
    const size = generateRandomNumber(50, 75);
    this.element.size = size;

    // Add an event listener to the balloon
    this.element.addEventListener('click', this.pop.bind(this));
  }

  public isRising() {
    return this.element.isRising();
  }

  public rise() {
    this.element.image.src = this.balloonImageUrl;
    const duration = this.getRandomDuration();
    this.element.rise(duration);

    setTimeout(() => {
      this.remove();
    }, duration);
  }

  public remove() {
    this.element.remove();
  }

  public async pop() {
    // Remove the balloon
    this.remove();
    // Play the pop sound
    this.popSound.play();

    // Send message with the new count
    sendMessage({ action: 'incrementCount' });
  }

  public static getRandomBalloon() {
    // Get an array of balloon classes
    const balloonClasses = Object.values(balloons);

    // Get a random index
    const index = Math.floor(Math.random() * balloonClasses.length);

    // Return a new instance of the selected balloon class
    return new balloonClasses[index]();
  }
}
