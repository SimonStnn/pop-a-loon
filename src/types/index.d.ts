import log from 'loglevel';

declare module 'loglevel' {
  export interface RootLogger {
    time: (level: log.LogLevelNames, label: string) => void;
    timeEnd: (level: log.LogLevelNames, label: string) => void;
    group: (level: log.LogLevelNames, label: string) => void;
    groupCollapsed: (level: log.LogLevelNames, label: string) => void;
    groupEnd: (level: log.LogLevelNames) => void;
    softwarn: (message?: any, ...optionalParams: any[]) => void;
    softerror: (message?: any, ...optionalParams: any[]) => void;
  }
}

export type LogLevelNames = log.LogLevelNames | 'softwarn' | 'softerror';
