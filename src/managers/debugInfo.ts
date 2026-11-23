import browser from 'webextension-polyfill';
import remote from '@/remote';
import { getBrowser } from '@/utils';
import type { DebugInfoResponse } from '@/const';

const SECRET_KEYS = new Set([
  'token',
  'recoveryCode',
  'pendingRecoveryCode',
  'code',
  'email',
  'spawnToken',
]);
const REDACTED = '[redacted]';

/** Recursively replace credential values so diagnostics are safe to share. */
export function redactSecrets<T>(value: T): T {
  if (Array.isArray(value)) return value.map(redactSecrets) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        SECRET_KEYS.has(key) && item !== '' && item != null
          ? REDACTED
          : redactSecrets(item),
      ])
    ) as T;
  }
  return value;
}

export type PopupDebugInfo = {
  runtime: {
    version: string;
    mode: string;
    browser: string;
    remoteFlag: string;
    extensionId: string;
    extensionUrl: string;
    platform: string;
  };
  storage: {
    sync: Record<string, unknown>;
    local: Record<string, unknown>;
    tokenConfigured: boolean;
  };
  alarms: browser.Alarms.Alarm[];
  permissions: {
    origins: string[];
    permissions: string[];
  };
  remote: {
    baseUrl: string;
    available: boolean | null;
    lastChecked: number | null;
    status: string | null;
    error: string | null;
  };
  background: DebugInfoResponse;
};

/** Collect everything the popup can inspect on its own. */
export async function getPopupDebugInfo(
  background: DebugInfoResponse
): Promise<PopupDebugInfo> {
  const [sync, local, alarms, permissions, platform] = await Promise.all([
    browser.storage.sync.get(null) as Promise<Record<string, unknown>>,
    browser.storage.local.get(null) as Promise<Record<string, unknown>>,
    browser.alarms.getAll(),
    browser.permissions.getAll(),
    browser.runtime.getPlatformInfo(),
  ]);

  let status: string | null = null;
  let statusError: string | null = null;
  try {
    const result = await remote.getStatus();
    status = `${result.status} (backend ${result.version})`;
  } catch (e) {
    statusError = e instanceof Error ? e.message : String(e);
  }

  return {
    runtime: {
      version: process.env.npm_package_version ?? 'unknown',
      mode: process.env.NODE_ENV ?? 'unknown',
      browser: getBrowser(),
      remoteFlag: process.env.REMOTE ?? 'remote',
      extensionId: browser.runtime.id,
      extensionUrl: browser.runtime.getURL(''),
      platform: [platform.os, platform.arch].filter(Boolean).join(' / '),
    },
    storage: {
      sync: redactSecrets(sync),
      local: redactSecrets(local),
      tokenConfigured: Boolean(sync.token),
    },
    alarms,
    permissions: {
      origins: permissions.origins ?? [],
      permissions: permissions.permissions ?? [],
    },
    remote: {
      baseUrl: remote.baseUrl,
      available: remote.availability,
      lastChecked: remote.lastCheckedAt,
      status,
      error: statusError,
    },
    background,
  };
}
