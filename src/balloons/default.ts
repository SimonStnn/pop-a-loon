import Balloon, { balloonResourceLocation } from '@/balloon';
import storage from '@/managers/storage';
import { BalloonName } from '@/const';
import { joinPaths, random } from '@/utils';

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
  dir_name: BalloonName;
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
  /**
   * The size of the balloon.
   *
   * The first value is the minimum size and the second value is the maximum size.
   */
  size: [number, number];
  /**
   * The duration thresholds for the rise animation.
   *
   * The first value is the minimum duration and the second value is the maximum duration.
   */
  riseDurationThreshold: [number, number];
  /**
   * The duration thresholds for the swing animation.
   *
   * The first value is the minimum duration and the second value is the maximum duration.
   */
  swingDurationThreshold: [number, number];
  /**
   * The amount of pixels the balloon should wave back and forth.
   *
   * First `waveDegrees` to the right, return back to the center, then `waveDegrees` to the left.
   */
  swingOffset: number;
  /**
   * The degrees the balloon will tilt when back ant forth.
   */
  waveDegrees: number;
};

export default class Default extends Balloon {
  public static readonly spawn_chance: number = 0.9;

  public get name(): 'default' {
    return 'default';
  }

  public get options(): BalloonOptions {
    return {
      dir_name: this.name,
      imageUrl: this.originalPath('/balloon.svg'),
      popSoundUrl: this.originalPath('/pop.mp3'),
      size: [50, 75],
      riseDurationThreshold: [10000, 15000],
      swingDurationThreshold: [2, 4],
      swingOffset: 15,
      waveDegrees: 8,
    };
  }

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
    return joinPaths(
      balloonResourceLocation,
      this.options.dir_name,
      this.options.imageUrl
    );
  }

  /**
   * The URL of the pop sound.
   */
  public get popSoundUrl(): string {
    return joinPaths(
      balloonResourceLocation,
      this.options.dir_name,
      this.options.popSoundUrl
    );
  }

  /**
   * Get the path for the resources of the default balloon.
   *
   * This should only be used in the balloon.options.
   *
   * @param path The path of the resource.
   * @returns The original path of the resource.
   */
  protected originalPath(name: string): string {
    return joinPaths('..', 'default', name);
  }

  public build() {
    this.importStylesheet({
      id: 'default',
      name: this.originalPath('default.css'),
    });

    const positionX = random(5, 95);
    const size = random(this.options.size[0], this.options.size[1]);
    const riseDuration = random(
      this.options.riseDurationThreshold[0],
      this.options.riseDurationThreshold[1]
    );
    const waveDuration = random(
      this.options.swingDurationThreshold[0],
      this.options.swingDurationThreshold[1]
    );

    // Load the pop sound
    this.popSound.src = this.popSoundUrl;
    // Load the balloon image
    this.balloonImage.src = this.balloonImageUrl;

    this.element.classList.add('balloon');

    // Set css variables
    this.element.style.setProperty('--rise-to', -size + 'px');
    this.element.style.setProperty(
      '--swing-offset',
      this.options.swingOffset + 'px'
    );
    this.element.style.setProperty(
      '--wave-deg',
      this.options.waveDegrees + 'deg'
    );

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
