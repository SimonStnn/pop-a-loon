import { useCallback, useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import log, { type LogLevelNumbers } from '@/managers/log';
import storage from '@/managers/storage';
import { sendMessage } from '@/utils';

const isDebug = () => log.getLevel() === log.levels.DEBUG;

/** Shared debug-logging state, kept in sync across extension pages. */
export function useDebugMode() {
  const [enabled, setEnabled] = useState(isDebug);

  useEffect(() => {
    const onChanged = async (
      changes: Record<string, browser.Storage.StorageChange>,
      areaName: string
    ) => {
      if (areaName !== 'local' || !('loglevel' in changes)) return;
      const level = changes.loglevel.newValue as LogLevelNumbers | undefined;
      if (typeof level !== 'number') return;
      // Apply the change from the other context to our own logger before
      // updating the UI. Skip the no-op write to avoid an event loop.
      if (log.getLevel() !== level) await log.setLevel(level);
      setEnabled(level === log.levels.DEBUG);
    };
    browser.storage.onChanged.addListener(onChanged);

    (async () => {
      const stored = await storage.local.get('loglevel');
      if (typeof stored === 'number' && log.getLevel() !== stored) {
        await log.setLevel(stored);
      }
      setEnabled(log.getLevel() === log.levels.DEBUG);
    })();

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
