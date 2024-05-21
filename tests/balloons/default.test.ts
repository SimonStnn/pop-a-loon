import { Default } from '@/balloons';

describe('Default Balloon', () => {
  let balloon: Default;

  beforeEach(() => {
    balloon = new Default();
  });

  test('name should be "default"', () => {
    expect(balloon.name).toBe('default');
  });

  test('name should be the same as the class name', () => {
    expect(balloon.name).toBe('default');
    expect(balloon.name).toBe(Default.name.toLowerCase());
  });
});
