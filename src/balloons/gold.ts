import Default, { BalloonOptions } from './default';

export default class Gold extends Default {
  public static readonly spawn_chance: number = 1.05;
  // @ts-ignore
  public get name(): 'gold' {
    return 'gold';
  }

  public get options(): BalloonOptions {
    return {
      ...super.options,
      imageUrl: '/balloon.svg',
      riseDurationThreshold: [15000, 20000],
      swingDurationThreshold: [3, 4],
      size: [100, 125],
    };
  }
}
