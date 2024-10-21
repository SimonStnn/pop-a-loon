import Default, { BalloonOptions } from './default';
import { random } from '@/utils';

type GhostOptions = BalloonOptions & {
  fadeSpeed: number | [number, number];
};

export default class Ghost extends Default {
  public static readonly spawn_chance: number = 0.1;
  // @ts-ignore
  public get name(): 'ghost' {
    return 'ghost';
  }

  public get options(): GhostOptions {
    return {
      ...super.options,
      imageUrl: 'balloon.svg',
      riseDuration: [18000, 21000],
      swingDuration: [3, 4],
      swingOffset: 70,
      fadeSpeed: [2000, 3000],
    };
  }

  public build(): void {
    super.build();
    this.importStylesheet('ghost.css');

    const animationSpeed =
      typeof this.options.fadeSpeed === 'number'
        ? this.options.fadeSpeed
        : random(this.options.fadeSpeed[0], this.options.fadeSpeed[1]);
    this.element.style.setProperty('--animation-speed', `${animationSpeed}ms`);
  }
}
