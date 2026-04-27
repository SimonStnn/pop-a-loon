import Default, { BalloonOptions } from './default';

export default class Bubble extends Default {
  public static readonly spawn_chance: number = 0.1;
  // @ts-ignore
  public get name(): 'bubble' {
    return 'bubble';
  }

  public get options(): BalloonOptions {
    return {
      ...super.options,
      imageUrl: 'bubble.svg',
      size: [40, 70],
      waveDegrees: 5,
      swingDuration: [1, 2],
    };
  }

  public build(): void {
    super.build();
    this.importStylesheet('bubble.css');
  }
}
