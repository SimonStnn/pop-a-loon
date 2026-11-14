import { Christmas } from '@/balloons';

describe('Christmas Balloon', () => {
  test('uses its Christmas artwork and its own pop sound', () => {
    const balloon = new Christmas();

    expect(balloon.name).toBe('christmas');
    expect(balloon.balloonImageUrl).toContain('/christmas/balloon.svg');
    expect(balloon.popSoundUrl).toContain('/christmas/pop.mp3');
  });
});
