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
});
