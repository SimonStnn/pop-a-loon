import { mockFetchResponse } from './__mocks__/fetch';
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
});
