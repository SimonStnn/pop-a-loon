import browser from 'webextension-polyfill';
import storage from '@/storage';
import { getBalloonContainer, random, sendMessage } from '@utils';

export const balloonResourceLocation = browser.runtime.getURL(
  'resources/balloons/'
);
export const defaultBalloonFolderName = 'default';
export const defaultBalloonResourceLocation =
  balloonResourceLocation + `${defaultBalloonFolderName}/`;

const buildBalloonElement = (
  element: HTMLDivElement,
  props: {
    size: number;
    positionX: number;
    riseDuration: number;
    waveDuration: number;
    onAnimationend: () => void;
  }
) => {
  const balloon = document.createElement('div');
  balloon.classList.add('balloon');

  // Set the balloon's width and height
  balloon.style.width = props.size + 'px';
  balloon.style.height = balloon.style.width;
  balloon.style.left = `calc(${props.positionX.toString() + 'vw'} - ${props.size / 2}px)`;
  balloon.style.animationDuration = props.riseDuration.toString() + 'ms';
  balloon.style.animationTimingFunction = 'linear';
  balloon.style.animationFillMode = 'forwards';
  balloon.style.animationName = 'rise';
  balloon.addEventListener('animationend', props.onAnimationend);

  // Create a second div and apply the swing animation to it
  const swingElement = document.createElement('div');
  swingElement.style.animation = `swing ${props.waveDuration}s infinite ease-in-out`;
  const waveElement = document.createElement('div');
  waveElement.style.animation = `wave ${props.waveDuration / 2}s infinite ease-in-out alternate`;
  waveElement.style.animationDelay = `${props.waveDuration / 4}s`;

  balloon.appendChild(swingElement);
  swingElement.appendChild(waveElement);
  waveElement.appendChild(element);

  return balloon;
};

export default abstract class Balloon {
  public abstract readonly name: string;

  private readonly _popSound: HTMLAudioElement = new Audio();

  protected readonly balloonImage: HTMLImageElement =
    document.createElement('img');

  public readonly element: HTMLDivElement;
  public readonly riseDurationThreshold: [number, number] = [10000, 15000];

  public get popSound(): HTMLAudioElement {
    if (!this._popSound.src) {
      this._popSound.src = this.popSoundUrl;
    }
    return this._popSound;
  }

  public get balloonImageUrl(): string {
    return balloonResourceLocation + this.name + '/icon.png';
  }

  public get popSoundUrl(): string {
    return balloonResourceLocation + this.name + '/pop.mp3';
  }

  constructor() {
    // Create the balloon element
    this.element = document.createElement('div');

    // Add the balloon image to the balloon element
    this.element.appendChild(this.balloonImage);

    // Add an event listener to the balloon
    this.element.addEventListener('click', this._pop.bind(this));

    this.balloonImage.addEventListener('error', (e) => {
      this.balloonImage.src = defaultBalloonResourceLocation + 'icon.png';
    });
  }

  public isRising(): boolean {
    return this.element.style.animationName === 'rise';
  }

  public getRandomDuration(
    duration: [number, number] = this.riseDurationThreshold
  ): number {
    return random(duration[0], duration[1]);
  }

  public rise(): void {
    // Load the balloon image
    this.balloonImage.src = this.balloonImageUrl;
    // Build the balloon element
    const balloonElement = buildBalloonElement(this.element, {
      size: random(50, 75),
      positionX: random(5, 95),
      riseDuration: this.getRandomDuration(),
      waveDuration: random(2, 4),
      onAnimationend: this.remove.bind(this),
    });
    // Add the balloon to the container
    getBalloonContainer().appendChild(balloonElement);
  }

  public remove(): void {
    this.element.remove();
    this.element.style.animationName = 'none';
  }

  private async _pop(event: MouseEvent): Promise<void> {
    // Remove the balloon
    this.remove();

    // Send message with the new count
    sendMessage({ action: 'incrementCount' });

    // Set volume
    this.popSound.volume = (await storage.get('config')).popVolume / 100;
    // Play the pop sound
    this.popSound.play().catch((e) => {
      this.popSound.src = defaultBalloonResourceLocation + 'pop.mp3';
      this.popSound.play();
    });

    this.pop(event);
  }

  public pop(event?: MouseEvent): void | Promise<void> {}
}
