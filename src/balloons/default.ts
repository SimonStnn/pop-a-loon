import Balloon from '@/balloon';
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

export default class Default extends Balloon {
  public static readonly spawn_chance: number = 0.9;
  public readonly options = { name: 'default' };

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

    const balloon = document.createElement('div');
    balloon.classList.add('balloon');

    // Set the balloon's width and height
    balloon.style.width = size + 'px';
    balloon.style.height = balloon.style.width;
    balloon.style.left = `calc(${positionX.toString() + 'vw'} - ${size / 2}px)`;
    balloon.style.animationDuration = riseDuration.toString() + 'ms';
    balloon.style.animationTimingFunction = 'linear';
    balloon.style.animationFillMode = 'forwards';
    balloon.style.animationName = 'rise';
    balloon.addEventListener('animationend', this.remove.bind(this));

    // Create a second div and apply the swing animation to it
    const swingElement = document.createElement('div');
    swingElement.style.animation = `swing ${waveDuration}s infinite ease-in-out`;
    const waveElement = document.createElement('div');
    waveElement.style.animation = `wave ${waveDuration / 2}s infinite ease-in-out alternate`;
    // Start wave animation at -3/4 of the swing animation (makes sure the wave has started before the balloon comes on screen)
    waveElement.style.animationDelay = `-${(waveDuration * 3) / 4}s`;

    balloon.appendChild(swingElement);
    swingElement.appendChild(waveElement);
    waveElement.appendChild(this.element);

    return balloon;
  }
}
