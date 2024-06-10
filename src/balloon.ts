import browser from 'webextension-polyfill';
import storage from '@/managers/storage';
import { getBalloonContainer, random, sendMessage } from '@/utils';

/**
 * The options for the balloon.
 */
export type BalloonOptions = {
  /**
   * The name of the balloon. It should be the same as the name of the class in lower case.
   *
   * This is used to determine the folder name for the balloon resources.
   */
  name: string;
  /**
   * The URL of the image to display on the balloon.
   * If not provided, the default image will be used.
   */
  imageUrl?: string;
  /**
   * The URL of the sound to play when the balloon is popped.
   * If not provided, the default sound will be used.
   */
  popSoundUrl?: string;
};

export type DefaultBalloonOptions = Required<BalloonOptions>;

/**
 * The default options for the balloon. These are used when the options are not provided.
 */
const defaultBalloonOptions: DefaultBalloonOptions = {
  name: 'default',
  imageUrl: '/icon.png',
  popSoundUrl: '/pop.mp3',
};

/**
 * The location of the balloon resources. (`resources/balloons/`)
 */
export const balloonResourceLocation = browser.runtime.getURL(
  'resources/balloons/'
);
export const defaultBalloonFolderName = 'default';
/**
 * The location of the default balloon resources. (`resources/balloons/default/`)
 */
export const defaultBalloonResourceLocation =
  balloonResourceLocation + `${defaultBalloonFolderName}/`;

export type BuildProps = {
  size: number;
  positionX: number;
  riseDuration: number;
  waveDuration: number;
  onAnimationend: () => void;
};

export default abstract class Balloon {
  /**
   * The options for the balloon.
   */
  public abstract readonly options: BalloonOptions;

  /**
   * Build a balloon element.
   *
   * This function creates a new balloon element and adds it to the balloon container.
   *
   * @param element The element to add to the balloon.
   * @param props The properties for the balloon element.
   * @returns The balloon element.
   */
  public abstract build(props: BuildProps): HTMLDivElement;

  /**
   * The sound element for the pop sound.
   */
  private readonly _popSound: HTMLAudioElement = new Audio();

  /**
   * The image element for the balloon image.
   */
  protected readonly balloonImage: HTMLImageElement =
    document.createElement('img');

  public readonly element: HTMLDivElement = document.createElement('div');
  /**
   * The duration thresholds for the rise animation.
   *
   * The first value is the minimum duration and the second value is the maximum duration.
   */
  public readonly riseDurationThreshold: [number, number] = [10000, 15000];
  /**
   * The duration thresholds for the swing animation.
   *
   * The first value is the minimum duration and the second value is the maximum duration.
   */
  public readonly swingDurationThreshold: [number, number] = [2, 4];

  /**
   * The name of the balloon.
   *
   * Should be the same as the name of the class in lower case.
   *
   * This is used to determine the folder name for the balloon resources.
   */
  public get name(): string {
    return this.options.name;
  }

  /**
   * The audio element for the pop sound.
   */
  public get popSound(): HTMLAudioElement {
    if (!this._popSound.src) {
      this._popSound.src = this.popSoundUrl;
    }
    return this._popSound;
  }

  /**
   * The URL of the balloon image.
   */
  public get balloonImageUrl(): string {
    return (
      balloonResourceLocation +
      (this.options.imageUrl ? this.options.name : defaultBalloonOptions.name) +
      (this.options.imageUrl ?? defaultBalloonOptions.imageUrl)
    );
  }

  /**
   * The URL of the pop sound.
   */
  public get popSoundUrl(): string {
    return (
      balloonResourceLocation +
      (this.options.popSoundUrl
        ? this.options.name
        : defaultBalloonOptions.name) +
      (this.options.popSoundUrl ?? defaultBalloonOptions.popSoundUrl)
    );
  }

  /**
   * The top element of the balloon. Which is a direct child of the balloon container.
   */
  public get topElement(): HTMLDivElement {
    let element = this.element;
    while (!element.classList.contains('balloon')) {
      if (
        !element.parentElement ||
        !(element.parentElement instanceof HTMLDivElement) ||
        element.parentElement === getBalloonContainer()
      )
        return element;
      element = element.parentElement;
    }
    return element;
  }

  constructor() {
    // Add the balloon image to the balloon element
    this.element.appendChild(this.balloonImage);

    // Add an event listener to the balloon
    this.element.addEventListener('click', this._pop.bind(this));
  }

  /**
   * @returns Whether the balloon is rising.
   */
  public isRising(): boolean {
    return this.topElement.style.animationName === 'rise';
  }

  /**
   * Make the balloon rise.
   *
   * This will create a new balloon element and add it to the balloon container.
   */
  public rise(): void {
    // Load the pop sound
    const _ = this.popSound;
    // Load the balloon image
    this.balloonImage.src = this.balloonImageUrl;
    // Build the balloon element
    const balloonElement = this.buildBalloonElement(this.element, {
      size: random(50, 75),
      positionX: random(5, 95),
      riseDuration: random(
        this.riseDurationThreshold[0],
        this.riseDurationThreshold[1]
      ),
      waveDuration: random(
        this.swingDurationThreshold[0],
        this.swingDurationThreshold[1]
      ),
      onAnimationend: this.remove.bind(this),
    });
    // Add the balloon to the container
    getBalloonContainer().appendChild(balloonElement);
  }

  /**
   * Remove the balloon.
   */
  public remove(): void {
    // loop until the parent node has 'balloon' class
    this.topElement.remove();
    this.topElement.style.animationName = 'none';
  }

  /**
   * Pop the balloon.
   *
   * This will remove the balloon, play the pop sound and send a message to increment the count.
   *
   * @param event The mouse event that triggered the pop.
   */
  private async _pop(event: MouseEvent): Promise<void> {
    // Remove the balloon
    this.remove();

    // Send message with the new count
    sendMessage({ action: 'incrementCount' });

    // Set volume
    this.popSound.volume = (await storage.sync.get('config')).popVolume / 100;
    // Play the pop sound
    this.popSound.play();

    this.pop(event);
  }

  /**
   * Pop the balloon.
   *
   * This will be called after the balloon is removed and the pop sound is played.
   *
   * @param event The mouse event that triggered the pop.
   */
  public pop(event?: MouseEvent): void | Promise<void> {}
}
