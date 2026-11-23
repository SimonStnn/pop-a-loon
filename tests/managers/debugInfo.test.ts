import { redactSecrets } from '@/managers/debugInfo';

describe('redactSecrets', () => {
  test('redacts credentials at any depth', () => {
    const input = {
      token: 'secret-token',
      user: {
        id: 'user-1',
        username: 'John',
        email: 'john@example.com',
      },
      spawnSchedule: {
        spawnToken: 'spawn-secret',
        balloonType: 'default',
      },
      recoveryCode: { code: 'ABCD-EFGH' },
    };

    expect(redactSecrets(input)).toEqual({
      token: '[redacted]',
      user: {
        id: 'user-1',
        username: 'John',
        email: '[redacted]',
      },
      spawnSchedule: {
        spawnToken: '[redacted]',
        balloonType: 'default',
      },
      recoveryCode: '[redacted]',
    });
  });

  test('keeps empty credential values as-is', () => {
    expect(redactSecrets({ token: '', pendingRecoveryCode: '' })).toEqual({
      token: '',
      pendingRecoveryCode: '',
    });
  });

  test('redacts credentials inside arrays without mutating the input', () => {
    const input = [{ code: 'secret' }, { code: '' }];
    const result = redactSecrets(input);

    expect(result).toEqual([{ code: '[redacted]' }, { code: '' }]);
    expect(input[0].code).toBe('secret');
  });
});
