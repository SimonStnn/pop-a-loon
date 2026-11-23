import { AlertCircle, Copy, RotateCcw } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import browser from 'webextension-polyfill';
import Main from '@/components/Main';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPopupDebugInfo, type PopupDebugInfo } from '@/managers/debugInfo';
import log from '@/managers/log';
import { useDebugMode } from '@/popup/hooks/useDebugMode';
import type { DebugInfoResponse, Message } from '@/const';

const formatTime = (value: number | null | undefined) =>
  value ? new Date(value).toLocaleString() : '—';

const formatDuration = (ms: number) => {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-2 border-b py-1 text-xs last:border-0">
    <span className="shrink-0 text-muted-foreground">{label}</span>
    <span className="break-all text-right font-mono">{value}</span>
  </div>
);

const JsonBlock = ({ value }: { value: unknown }) => (
  <pre className="max-h-52 overflow-auto rounded bg-muted p-2 text-[10px] leading-tight">
    {JSON.stringify(value, null, 2)}
  </pre>
);

export default () => {
  const { enabled, toggle } = useDebugMode();
  const [info, setInfo] = useState<PopupDebugInfo | null>(null);
  const [messages, setMessages] = useState<{ at: number; message: Message }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const background = (await browser.runtime.sendMessage({
        action: 'getDebugInfo',
      })) as DebugInfoResponse;
      setInfo(await getPopupDebugInfo(background));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    refresh();

    const onMessage = (message: Message) => {
      setMessages((previous) =>
        [{ at: Date.now(), message }, ...previous].slice(0, 50)
      );
    };
    browser.runtime.onMessage.addListener(onMessage);
    browser.storage.onChanged.addListener(refresh);
    browser.alarms.onAlarm.addListener(refresh);
    const timer = window.setInterval(refresh, 5000);

    return () => {
      browser.runtime.onMessage.removeListener(onMessage);
      browser.storage.onChanged.removeListener(refresh);
      browser.alarms.onAlarm.removeListener(refresh);
      window.clearInterval(timer);
    };
  }, [enabled, refresh]);

  if (!enabled)
    return (
      <Main>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Enable debug logging in Settings to view developer information.{' '}
            <Link className="underline" to="/settings">
              Open Settings
            </Link>
          </AlertDescription>
        </Alert>
      </Main>
    );

  const copyDiagnostics = () => {
    if (!info) return;
    const textarea = document.createElement('textarea');
    textarea.value = JSON.stringify({ ...info, messages }, null, 2);
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    textarea.remove();
    setCopied(successful);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Main>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Tabs defaultValue="runtime">
        <TabsList size="sm" stretch className="w-full">
          <TabsTrigger size="sm" value="runtime">
            Runtime
          </TabsTrigger>
          <TabsTrigger size="sm" value="storage">
            Storage
          </TabsTrigger>
          <TabsTrigger size="sm" value="alarms">
            Alarms
          </TabsTrigger>
          <TabsTrigger size="sm" value="remote">
            Remote
          </TabsTrigger>
          <TabsTrigger size="sm" value="actions">
            Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="runtime" className="space-y-0.5">
          <Row label="Version" value={info?.runtime.version} />
          <Row label="Mode" value={info?.runtime.mode} />
          <Row label="Browser" value={info?.runtime.browser} />
          <Row label="Remote flag" value={info?.runtime.remoteFlag} />
          <Row label="Platform" value={info?.runtime.platform} />
          <Row label="Extension ID" value={info?.runtime.extensionId} />
          <Row label="Extension URL" value={info?.runtime.extensionUrl} />
          <Row
            label="Uptime"
            value={
              info
                ? formatDuration(Date.now() - info.background.startedAt)
                : '—'
            }
          />
        </TabsContent>

        <TabsContent value="storage" className="space-y-2">
          <p className="text-[10px] text-muted-foreground">
            Credentials are redacted.
          </p>
          <Row
            label="Auth token"
            value={info?.storage.tokenConfigured ? 'set' : 'not set'}
          />
          <h3 className="text-xs font-semibold">sync storage</h3>
          <JsonBlock value={info?.storage.sync} />
          <h3 className="text-xs font-semibold">local storage</h3>
          <JsonBlock value={info?.storage.local} />
        </TabsContent>

        <TabsContent value="alarms" className="space-y-0.5">
          <Row
            label="Schedule"
            value={
              !info?.schedule
                ? 'none'
                : info.schedule.spawned
                  ? 'spawned'
                  : Date.now() >= info.schedule.expiresAt
                    ? 'expired'
                    : 'pending'
            }
          />
          <Row
            label="Spawn token"
            value={info?.schedule?.tokenConfigured ? 'set' : 'none'}
          />
          <Row label="Spawn at" value={formatTime(info?.schedule?.spawnAt)} />
          <Row
            label="Expires at"
            value={formatTime(info?.schedule?.expiresAt)}
          />
          <Row
            label="Last spawn"
            value={formatTime(info?.background.lastSpawn)}
          />
          <Row
            label="Spawn timeout"
            value={formatTime(info?.background.spawnTimeout)}
          />
          {info?.alarms.length ? (
            info.alarms.map((alarm) => (
              <Row
                key={alarm.name}
                label={alarm.name}
                value={formatTime(alarm.scheduledTime)}
              />
            ))
          ) : (
            <p className="py-1 text-xs text-muted-foreground">
              No alarms scheduled.
            </p>
          )}
        </TabsContent>

        <TabsContent value="remote" className="space-y-2">
          <Row label="Base URL" value={info?.remote.baseUrl} />
          <Row label="Available" value={String(info?.remote.available)} />
          <Row
            label="Last checked"
            value={formatTime(info?.remote.lastChecked)}
          />
          <Row
            label="Status"
            value={info?.remote.status ?? info?.remote.error ?? 'unknown'}
          />
          <Row
            label="Log level"
            value={info ? log.toLogLevelName(info.background.logLevel) : '—'}
          />
          <h3 className="text-xs font-semibold">Messages (live)</h3>
          {messages.length ? (
            <div className="space-y-1">
              {messages.map(({ at, message }, index) => (
                <div
                  key={index}
                  className="rounded bg-muted p-1 font-mono text-[10px]"
                >
                  <span className="text-muted-foreground">
                    {new Date(at).toLocaleTimeString()}{' '}
                  </span>
                  {JSON.stringify(message)}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Waiting for runtime messages…
            </p>
          )}
        </TabsContent>

        <TabsContent value="actions" className="space-y-2">
          <Button
            className="w-full"
            size="xs"
            variant="outline"
            onClick={toggle}
          >
            {enabled ? 'Disable debug logging' : 'Enable debug logging'}
          </Button>
          <Button
            className="w-full"
            size="xs"
            variant="outline"
            onClick={() => browser.runtime.reload()}
          >
            <RotateCcw className="size-3" /> Reload extension
          </Button>
          <Button
            className="w-full"
            size="xs"
            variant="outline"
            onClick={copyDiagnostics}
            disabled={!info}
          >
            <Copy className="size-3" /> {copied ? 'Copied' : 'Copy diagnostics'}
          </Button>
        </TabsContent>
      </Tabs>
    </Main>
  );
};
