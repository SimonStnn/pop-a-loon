import { Default } from '@/balloons';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Default Balloon', () => {
  let balloon: Default;

  beforeEach(() => {
    balloon = new Default();

    fetchMock.resetMocks();
  });

  test('name should be "default"', () => {
    expect(balloon.name).toBe('default');
  });

  test('name should be the same as the class name', () => {
    expect(balloon.name).toBe('default');
    expect(balloon.name).toBe(Default.name.toLowerCase());
  });
});
