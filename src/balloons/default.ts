import Balloon, { balloonResourceLocation } from '@/balloon';
import storage from '@/managers/storage';
import { random } from '@/utils';

export type BuildProps = {
  size: number;
  positionX: number;
  riseDuration: number;
  waveDuration: number;
  onAnimationend: () => void;
};

/**
 * The options for the balloon.
 */
export type BalloonOptions = {
  /**
   * The name of the balloon. It should be the same as the name of the class in lower case.
   *
   * This is used to determine the folder name for the balloon resources.
   */
  dir_name: string;
  /**
   * The URL of the image to display on the balloon.
   * If not provided, the default image will be used.
   */
  imageUrl: string;
  /**
   * The URL of the sound to play when the balloon is popped.
   * If not provided, the default sound will be used.
   */
  popSoundUrl: string;
};

export default class Default extends Balloon {
  public static readonly spawn_chance: number = 0.9;
  public readonly name: string = 'default';
  public readonly options: BalloonOptions = {
    dir_name: this.name,
    imageUrl: '/icon.png',
    popSoundUrl: '/pop.mp3',
  };

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
   * The image element for the balloon image.
   */
  public readonly balloonImage: HTMLImageElement =
    document.createElement('img');

  /**
   * The sound element for the pop sound.
   */
  public readonly popSound: HTMLAudioElement = new Audio();

  /**
   * The URL of the balloon image.
   */
  public get balloonImageUrl(): string {
    return (
      balloonResourceLocation + this.options.dir_name + this.options.imageUrl
    );
  }

  /**
   * The URL of the pop sound.
   */
  public get popSoundUrl(): string {
    return (
      balloonResourceLocation + this.options.dir_name + this.options.popSoundUrl
    );
  }

  constructor() {
    super();
    // Load the pop sound
    this.popSound.src = this.popSoundUrl;
    // Load the balloon image
    this.balloonImage.src = this.balloonImageUrl;
  }

  public build() {
    const size = random(50, 75);
    const positionX = random(5, 95);
    const riseDuration = random(
      this.riseDurationThreshold[0],
      this.riseDurationThreshold[1]
    );
    const waveDuration = random(
      this.swingDurationThreshold[0],
      this.swingDurationThreshold[1]
    );

    this.element.classList.add('balloon');

    // Set the balloon's width and height
    this.element.style.width = size + 'px';
    this.element.style.height = this.element.style.width;
    this.element.style.left = `calc(${positionX.toString() + 'vw'} - ${size / 2}px)`;
    this.element.style.animationDuration = riseDuration.toString() + 'ms';
    this.element.style.animationTimingFunction = 'linear';
    this.element.style.animationFillMode = 'forwards';
    this.element.style.animationName = 'rise';
    this.element.addEventListener('animationend', this.remove.bind(this));

    // Create a second div and apply the swing animation to it
    const swingElement = document.createElement('div');
    swingElement.style.animation = `swing ${waveDuration}s infinite ease-in-out`;
    const waveElement = document.createElement('div');
    waveElement.style.animation = `wave ${waveDuration / 2}s infinite ease-in-out alternate`;
    // Start wave animation at -3/4 of the swing animation (makes sure the wave has started before the balloon comes on screen)
    waveElement.style.animationDelay = `-${(waveDuration * 3) / 4}s`;

    swingElement.appendChild(waveElement);
    waveElement.appendChild(this.balloonImage);
    this.element.appendChild(swingElement);
  }

  public async pop(event: MouseEvent) {
    super.pop();
    // Set volume
    this.popSound.volume = (await storage.sync.get('config')).popVolume / 100;
    // Play the pop sound
    this.popSound.play();
  }
}
