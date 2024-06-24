import Balloon from '@/balloon';
import { BalloonName } from '@/const';

// Create a concrete subclass of Balloon for testing
class TestBalloon extends Balloon {
  public readonly name = 'test' as BalloonName;
  build() {
    return document.createElement('div');
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

  test('balloon should not be rising after remove is called', () => {
    balloon.rise();
    balloon.remove();
    expect(balloon.isRising()).toBe(false);
  });
});
