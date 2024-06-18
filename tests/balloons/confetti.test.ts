import { Confetti } from '@/balloons';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Confetti Balloon', () => {
  let balloon: Confetti;

  beforeEach(() => {
    balloon = new Confetti();

    fetchMock.resetMocks();
  });

  test('name should be "confetti"', () => {
    expect(balloon.name).toBe('confetti');
  });

  test('name should be the same as the class name', () => {
    expect(balloon.name).toBe('confetti');
    expect(balloon.name).toBe(Confetti.name.toLowerCase());
  });
});
