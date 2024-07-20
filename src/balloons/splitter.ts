import Default, { BalloonOptions } from '@/balloons/default';
import { getBalloonContainer } from '@/utils';

export default class Splitter extends Default {
  public static readonly spawn_chance: number = 5.2;
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
    if (this.parent) {
      this.size = this.parent.size * 0.8;
    }
  }

  protected split(event: MouseEvent) {
    const container = getBalloonContainer();
    const rect = this.element.getBoundingClientRect();
    const children = [
      new Splitter(this, [
        event.clientX - rect.width / 2 - 50,
        container.clientHeight - rect.top - rect.height,
      ]),
      new Splitter(this, [
        event.clientX - rect.width / 2 + 50,
        container.clientHeight - rect.top - rect.height,
      ]),
    ];
    this.children.push(...children);
    this.children.forEach((child) => {
      child.rise();
    });
  }

  public build() {
    super.build();
    this.importStylesheet();

    if (this.parent && this.pos) {
      this.element.style.left = `${this.pos[0]}px`;
      this.element.style.setProperty('--rise-from', `${this.pos[1]}px`);
      this.element.style.setProperty(
        '--rise-to',
        `calc(100vh + ${this.pos[1]}px)`
      );
    }
  }

  public async pop(event: MouseEvent) {
    if (this.depth > 1) {
      super.pop(event);
      return;
    }
    this.popSound.play();
    this.split(event);
    this.remove();
  }
}
