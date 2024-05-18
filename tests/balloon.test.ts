import Balloon from '@/balloon';
import { random } from '@utils';

// Create a concrete subclass of Balloon for testing
class TestBalloon extends Balloon {
  public readonly name = 'test';
  getRandomDuration() {
    return random(10000, 15000);
  }
}

describe('Balloon', () => {
  let balloon: TestBalloon;

  beforeEach(() => {
    balloon = new TestBalloon();
  });

  test('isRising should return a boolean', () => {
    const isRising = balloon.isRising();
    expect(typeof isRising).toBe('boolean');
  });

  test('rise should not throw an error', () => {
    expect(() => balloon.rise()).not.toThrow();
  });

  test('remove should not throw an error', () => {
    expect(() => balloon.remove()).not.toThrow();
  });

  test('pop should not throw an error', () => {
    const mockPlay = jest.fn();
    jest
      .spyOn(window.HTMLMediaElement.prototype, 'play')
      .mockImplementation(mockPlay);

    expect(async () => await balloon.pop()).not.toThrow();

    mockPlay.mockRestore();
  });

  test('balloon name should be "test"', () => {
    expect(balloon.name).toBe('test');
  });

  test('getRandomDuration should return a number between 10000 and 15000', () => {
    const duration = balloon.getRandomDuration();
    expect(typeof duration).toBe('number');
    expect(duration).toBeGreaterThanOrEqual(10000);
    expect(duration).toBeLessThanOrEqual(15000);
  });

  test('balloon should be rising after rise is called', () => {
    expect(balloon.isRising()).toBe(false);
    balloon.rise();
    expect(balloon.isRising()).toBe(true);
  });

  test('balloon should not be rising after remove is called', () => {
    balloon.rise();
    balloon.remove();
    expect(balloon.isRising()).toBe(false);
  });
});
