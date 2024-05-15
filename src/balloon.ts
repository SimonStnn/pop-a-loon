import browser from 'webextension-polyfill';
import storage from '@/storage';
import { generateRandomNumber, sendMessage } from '@utils';

export const balloonContainer = document.createElement('div');
balloonContainer.id = 'balloon-container';

const resourceLocation = browser.runtime.getURL('resources/balloons/');

const buildBalloonElement = (
  element: HTMLDivElement,
  props: {
    balloonImage: HTMLImageElement;
    size: number;
    positionX: number;
    riseDuration: number;
    onAnimationend: () => void;
  }
) => {
  element.classList.add('balloon');

  // Add an image to the balloon
  element.appendChild(props.balloonImage);

  // Set the balloon's width and height
  element.style.width = props.size + 'px';
  element.style.height = element.style.width;
  element.style.left = `calc(${props.positionX.toString() + 'vw'} - ${props.size / 2}px)`;
  element.style.animationDuration = props.riseDuration.toString() + 'ms';
  element.style.animationTimingFunction = 'linear';
  element.style.animationFillMode = 'forwards';
  element.style.animationName = 'rise';
  element.addEventListener('animationend', props.onAnimationend);

  return element;
};

export default abstract class Balloon {
  public abstract readonly name: string;
  public abstract getRandomDuration(): number;

  private readonly element: HTMLDivElement;
  private readonly _popSound: HTMLAudioElement = new Audio();

  protected readonly balloonImage: HTMLImageElement =
    document.createElement('img');

  public get popSound(): HTMLAudioElement {
    if (!this._popSound.src) this._popSound.src = this.popSoundUrl;
    return this._popSound;
  }
  public get balloonImageUrl(): string {
    return resourceLocation + this.name + '/icon.png';
  }
  public get popSoundUrl(): string {
    return resourceLocation + this.name + '/pop.mp3';
  }

  constructor() {
    // Create the balloon element
    this.element = document.createElement('div');
    // Add an event listener to the balloon
    this.element.addEventListener('click', this.pop.bind(this));
  }

  public isRising() {
    return this.element.style.animationName === 'rise';
  }

  public rise() {
    // Load the balloon image
    this.balloonImage.src = this.balloonImageUrl;
    // Build the balloon element
    buildBalloonElement(this.element, {
      size: generateRandomNumber(50, 75),
      balloonImage: this.balloonImage,
      positionX: generateRandomNumber(5, 95),
      riseDuration: this.getRandomDuration(),
      onAnimationend: this.remove.bind(this),
    });
    // Add the balloon to the container
    balloonContainer.appendChild(this.element);
  }

  public remove() {
    this.element.remove();
    this.element.style.animationName = 'none';
  }

  public async pop() {
    // Remove the balloon
    this.remove();

    // Set volume
    this.popSound.volume = (await storage.get('config')).popVolume / 100;
    // Play the pop sound
    this.popSound.play();

    // Send message with the new count
    sendMessage({ action: 'incrementCount' });
  }
}
