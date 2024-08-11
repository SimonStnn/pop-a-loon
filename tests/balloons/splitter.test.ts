import fetchMock from 'jest-fetch-mock';
import { Splitter } from '@/balloons';

fetchMock.enableMocks();

describe('Splitter Balloon', () => {
  let balloon: Splitter;

  beforeEach(() => {
    balloon = new Splitter();

    fetchMock.resetMocks();
  });

  test('name should be "splitter"', () => {
    expect(balloon.name).toBe('splitter');
  });

  test('name should be the same as the class name', () => {
    expect(balloon.name).toBe('splitter');
    expect(balloon.name).toBe(Splitter.name.toLowerCase());
  });

  test('Root should be the same as the balloon', () => {
    expect((balloon as any).root).toBe(balloon);
  });
});
