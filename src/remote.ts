import { RemoteResponse, Prettify } from '@/const';
import storage from '@/storage';

interface RequestParams {
  [key: string]: string | number;
}

class BackendAPI {
  private static instance: BackendAPI;
  private static readonly BASE_URL = 'http://localhost:3000';

  private constructor() {}

  public static getInstance() {
    if (!BackendAPI.instance) {
      BackendAPI.instance = new BackendAPI();
    }
    return BackendAPI.instance;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    params?: RequestParams
  ): Promise<T> {
    const url = new URL(`${BackendAPI.BASE_URL}/api${endpoint}`);
    if (params) {
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, String(params[key]))
      );
    }
    const response = await fetch(url.toString(), {
      method,
      headers: {
        authorization: (await storage.get('token')) || '',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json() as Promise<T>;
  }

  public async getConfiguration() {
    return await this.request<RemoteResponse['configuration']>(
      'GET',
      '/configuration'
    );
  }

  public async getNewUser() {
    return await this.request<
      Prettify<{ token: string } & RemoteResponse['user']>
    >('POST', '/user');
  }

  public async getUser(id: string) {
    return await this.request<RemoteResponse['user']>('GET', `/user/${id}`);
  }
}

export default BackendAPI.getInstance();
