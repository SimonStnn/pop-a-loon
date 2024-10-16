import Default, { BalloonOptions } from './default';

export default class Ghost extends Default {
  public static readonly spawn_chance: number = 0.1;
  // @ts-ignore
  public get name(): 'ghost' {
    return 'ghost';
  }

  public get options(): BalloonOptions {
    return {
      ...super.options,
      imageUrl: 'balloon.svg',
      riseDuration: [15000, 20000],
      swingDuration: [3, 4],
      swingOffset: 25,
    };
  }
}