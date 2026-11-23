import { useCallback, useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import log from '@/managers/log';
import { sendMessage } from '@/utils';

const isDebug = () => log.getLevel() === log.levels.DEBUG;

/** Shared debug-logging state, kept in sync across extension pages. */
export function useDebugMode() {
  const [enabled, setEnabled] = useState(isDebug);

  useEffect(() => {
    const onChanged = (
      changes: Record<string, browser.Storage.StorageChange>,
      areaName: string
    ) => {
      if (areaName === 'local' && 'loglevel' in changes) setEnabled(isDebug());
    };
    browser.storage.onChanged.addListener(onChanged);
    setEnabled(isDebug());
    return () => browser.storage.onChanged.removeListener(onChanged);
  }, []);

  const toggle = useCallback(async () => {
    const level = isDebug() ? log.levels.INFO : log.levels.DEBUG;
    await log.setLevel(level);
    await sendMessage({ action: 'setLogLevel', level });
    setEnabled(level === log.levels.DEBUG);
  }, []);

  return { enabled, toggle };
}
