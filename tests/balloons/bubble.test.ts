import Balloon from '@/balloon';
import { Bubble } from '@/balloons';

describe('Bubble Balloon', () => {
  let balloon: Bubble;

  beforeEach(() => {
    balloon = new Bubble();
  });

  test('Bubble balloon extends the Balloon class', () => {
    expect(balloon).toBeInstanceOf(Balloon);
  });

  test('Bubble balloon has correct name', () => {
    expect(balloon.name).toBe('bubble');
  });

  test('Bubble balloon has static spawn_chance property', () => {
    expect(Bubble).toHaveProperty('spawn_chance');
    expect(typeof Bubble.spawn_chance).toBe('number');
    expect(Bubble.spawn_chance).toBeGreaterThanOrEqual(0);
    expect(Bubble.spawn_chance).toBeLessThanOrEqual(1);
  });

  test('Bubble balloon has required options', () => {
    expect(balloon.options).toHaveProperty('imageUrl');
    expect(balloon.options).toHaveProperty('riseDuration');
    expect(balloon.options).toHaveProperty('swingDuration');
    expect(balloon.options).toHaveProperty('swingOffset');
  });
});
