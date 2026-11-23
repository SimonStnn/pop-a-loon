import { mockFetchResponse, user as mockedUser } from './__mocks__/fetch';
import remote from '@/remote';

describe('BackendAPI', () => {
  beforeEach(() => {
    mockFetchResponse();
  });

  test('should return a response', async () => {
    const response = await remote.getStatus();
    expect(response).toBeDefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('should be available', async () => {
    const response = await remote.isAvailable();
    expect(response).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const response2 = await remote.isAvailable();
    expect(response2).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    // Simulate time passing
    remote['lastChecked'] = new Date(0);
    const response3 = await remote.isAvailable();
    expect(response3).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('should return a user', async () => {
    const response = await remote.getUser(mockedUser.id);
    expect(response).toEqual(mockedUser);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('should create a recovery code', async () => {
    const response = await remote.createRecoveryCode();
    expect(response.code).toBe('ABCD-EFGH-JKLM-NPQR-STUV-WXYZ');
    expect(fetchMock.mock.calls[0][0]).toContain('/user/recovery-code');
  });

  test('should send the recovery code in the request body', async () => {
    const response = await remote.recoverAccount(
      'ABCD-EFGH-JKLM-NPQR-STUV-WXYZ'
    );
    expect(response.token).toBe('testToken');
    expect(fetchMock.mock.calls[0][0]).toContain('/auth/recover');
    expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as string)).toEqual({
      code: 'ABCD-EFGH-JKLM-NPQR-STUV-WXYZ',
    });
  });
});
