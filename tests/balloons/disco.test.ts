import Balloon from '@/balloon';
import { Disco } from '@/balloons';

describe('Disco Balloon', () => {
  let balloon: Disco;

  beforeEach(() => {
    balloon = new Disco();
  });

  test('Disco balloon extends the Balloon class', () => {
    expect(balloon).toBeInstanceOf(Balloon);
  });

  test('Disco balloon has correct name', () => {
    expect(balloon.name).toBe('disco');
  });

  test('Disco balloon has static spawn_chance property', () => {
    expect(Disco).toHaveProperty('spawn_chance');
    expect(typeof Disco.spawn_chance).toBe('number');
    expect(Disco.spawn_chance).toBeGreaterThanOrEqual(0);
    expect(Disco.spawn_chance).toBeLessThanOrEqual(1);
  });

  test('Disco balloon has required options', () => {
    expect(balloon.options).toHaveProperty('imageUrl');
    expect(balloon.options).toHaveProperty('riseDuration');
    expect(balloon.options).toHaveProperty('swingDuration');
    expect(balloon.options).toHaveProperty('swingOffset');
  });
});
