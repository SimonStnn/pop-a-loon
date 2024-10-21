import Default, { BalloonOptions } from '@/balloons/default';
import { getBalloonContainer } from '@/utils';

export default class Splitter extends Default {
  public static readonly spawn_chance: number = 0.1;
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
  protected readonly maxSplits = 2;
  public readonly offset: number;

  public get depth(): number {
    return this.parent ? this.parent.depth + 1 : 0;
  }

  protected get root(): Splitter {
    let cur: Splitter = this;
    while (cur.parent) {
      cur = cur.parent;
    }
    return cur;
  }

  protected get siblings(): Splitter[] {
    return this.parent?.children.filter((child) => child !== this) || [];
  }

  public get offsetElement(): HTMLDivElement | null {
    if (!this.parent) return null;
    const element = this.element.querySelector('[data-element="offset"]');
    if (!element) throw new Error('Balloon is not built yet');
    return element as HTMLDivElement;
  }

  constructor();
  constructor(parent: Splitter, pos: [number, number], offset: number);
  constructor(parent?: Splitter, pos?: [number, number], offset = 0) {
    super();
    this.parent = parent || null;
    this.pos = pos || null;
    this.offset = offset;
    this.element.setAttribute('data-depth', this.depth.toString());
  }

  protected split(event: MouseEvent) {
    const container = getBalloonContainer();
    const rect = this.element.getBoundingClientRect();
    const children = [
      new Splitter(
        this,
        [
          event.clientX - rect.width / 2 - this.options.swingOffset,
          container.clientHeight - rect.top - rect.height,
        ],
        -50
      ),
      new Splitter(
        this,
        [
          event.clientX - rect.width / 2 + this.options.swingOffset,
          container.clientHeight - rect.top - rect.height,
        ],
        50
      ),
    ];
    this.children.push(...children);
    this.children.forEach((child) => {
      child.rise();
    });
  }

  public isLastChild(): boolean {
    if (this.depth < this.maxSplits) return false;
    const check = (splitter: Splitter): boolean => {
      for (const child of splitter.children) {
        if (this === child) continue;
        if (!child.isRemoved()) return false;
        if (!check(child)) return false;
      }
      return true;
    };
    return check(this.root);
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

      this.size = this.parent.size * (1 - this.depth * 0);

      const offsetElement = document.createElement('div');
      offsetElement.setAttribute('data-element', 'offset');
      this.element.appendChild(offsetElement);
      offsetElement.appendChild(this.swingElement);

      offsetElement.style.setProperty('--offset', `${this.offset}px`);
      offsetElement.style.animationName = `offset`;
      offsetElement.style.animationFillMode = 'forwards';
      offsetElement.style.animationDuration = '1500ms';
      offsetElement.style.animationTimingFunction = 'ease-in-out';

      if (this.parent.children[0] === this) this.swingDirection('left');
      else if (this.parent.children[this.parent.children.length - 1] === this)
        this.swingDirection('right');
    }
  }

  public async pop(event: MouseEvent) {
    if (this.depth < this.maxSplits) this.split(event);

    super.pop(event, { increaseCount: this === this.root });
  }

  public remove(event?: Event): void {
    // Remove the element if the balloon was clicked (event is undefined)
    // or if the event target is the balloon element
    // So it doesn't get removed when the offset animation ends
    if (event === undefined || event.target === this.element) {
      super.remove();
    }
  }
}
