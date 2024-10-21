import { Ghost } from '@/balloons';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Ghost Balloon', () => {
  let balloon: Ghost;

  beforeEach(() => {
    balloon = new Ghost();

    fetchMock.resetMocks();
  });

  test('name should be "ghost"', () => {
    expect(balloon.name).toBe('ghost');
  });

  test('name should be the same as the class name', () => {
    expect(balloon.name).toBe('ghost');
    expect(balloon.name).toBe(Ghost.name.toLowerCase());
  });
});
