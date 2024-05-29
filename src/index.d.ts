import log from 'loglevel';

declare module 'loglevel' {
  // Extend the Logger interface to include new methods
  export interface RootLogger {
    time: (level: log.LogLevelNames, label: string) => void;
    timeEnd: (level: log.LogLevelNames, label: string) => void;
    group: (level: log.LogLevelNames, label: string) => void;
    groupCollapsed: (level: log.LogLevelNames, label: string) => void;
    groupEnd: (level: log.LogLevelNames) => void;
  }
}
