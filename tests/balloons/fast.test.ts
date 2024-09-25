import { Fast } from '@/balloons';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Fast Balloon', () => {
  let balloon: Fast;

  beforeEach(() => {
    balloon = new Fast();

    fetchMock.resetMocks();
  });

  test('name should be "fast"', () => {
    expect(balloon.name).toBe('fast');
  });

  test('name should be the same as the class name', () => {
    expect(balloon.name).toBe('fast');
    expect(balloon.name).toBe(Fast.name.toLowerCase());
  });
});
