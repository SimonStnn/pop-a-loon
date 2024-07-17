import Default, { BalloonOptions } from '@/balloons/default';

export default class Splitter extends Default {
  public static readonly spawn_chance: number = 0.2;
  // @ts-ignore
  public get name(): 'splitter' {
    return 'splitter';
  }

  public get options(): BalloonOptions {
    return {
      ...super.options,
      imageUrl: 'balloon.svg',
    };
  }

  protected readonly parent: Splitter | null;
  protected readonly children: Splitter[] = [];
  protected readonly pos: [number, number] | null;

  public get depth(): number {
    return this.parent ? this.parent.depth + 1 : 0;
  }

  protected get siblings(): Splitter[] {
    return this.parent?.children.filter((child) => child !== this) || [];
  }

  constructor();
  constructor(parent: Splitter, pos: [number, number]);
  constructor(parent?: Splitter, pos?: [number, number]) {
    super();
    this.parent = parent || null;
    this.pos = pos || null;
    this.element.setAttribute('data-depth', this.depth.toString());
  }

  protected split(event: MouseEvent) {
    console.log('splitting', event);
    const children = [
      new Splitter(this, [event.clientX - 50, event.clientY]),
      new Splitter(this, [event.clientX + 50, event.clientY]),
    ];
    this.children.push(...children);
    this.children.forEach((child) => {
      child.rise();
    });
  }

  public build() {
    super.build();

    if (this.pos) {
      this.element.setAttribute('data-pos', this.pos.join(','));
      this.element.style.left = `${this.pos[0] - this.element.clientWidth / 2}px`;
      this.element.style.translate = `0 -${this.pos[1]}`;
    }
  }

  public async pop(event: MouseEvent) {
    if (this.depth > 1) {
      super.pop(event);
      return;
    }
    this.popSound.play();
    this.element.hidden = true;
    this.split(event);
  }
}
