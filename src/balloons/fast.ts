
import Default, { BalloonOptions } from './default';

export default class Fast extends Default {
  public static readonly spawn_chance: number = 0.1;
  // @ts-ignore
  public get name(): 'fast' {
    return 'fast';
  }

  public get options(): BalloonOptions {
    return {
      ...super.options,
      imageUrl: '/balloon.svg',
      riseDuration: [5000, 7500],
      size: [65, 75],
    };
  }
}