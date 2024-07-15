import { Gold } from '@/balloons';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Gold Balloon', () => {
  let balloon: Gold;

  beforeEach(() => {
    balloon = new Gold();

    fetchMock.resetMocks();
  });

  test('name should be "gold"', () => {
    expect(balloon.name).toBe('gold');
  });

  test('name should be the same as the class name', () => {
    expect(balloon.name).toBe('gold');
    expect(balloon.name).toBe(Gold.name.toLowerCase());
  });
});
