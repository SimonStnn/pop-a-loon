import loglevel from 'loglevel';
import storage from '@/managers/storage';

export interface LogLevel extends loglevel.LogLevel {
  SOFTWARN: typeof loglevel.levels.WARN;
  SOFTERROR: typeof loglevel.levels.ERROR;
}
export type LogLevelNumbers = LogLevel[keyof LogLevel];
export type LogLevelDesc =
  | LogLevelNumbers
  | LogLevelNames
  | 'silent'
  | keyof LogLevel;

export type LogLevelNames = loglevel.LogLevelNames | 'softwarn' | 'softerror';

const styles: Record<LogLevelNames, string> = {
  trace: 'color: #888;',
  debug: 'color: #888;',
  info: 'color: #4d0;',
  warn: 'color: #fa0;',
  softwarn: 'color: #fa0;',
  error: 'color: #d00;',
  softerror: 'color: #d00;',
};

const originalFactory = loglevel.methodFactory;

class CustomLog implements loglevel.Logger {
  public readonly levels = {
    ...loglevel.levels,
    SOFTWARN: loglevel.levels.WARN,
    SOFTERROR: loglevel.levels.ERROR,
  };

  constructor() {
    loglevel.methodFactory = this.methodFactory.bind(this);

    if (process.env.NODE_ENV === 'development')
      this.setLevel(this.levels.DEBUG);
    storage.local.set('loglevel', this.getLevel());

    const loglevelName = Object.keys(this.levels).find(
      (key) => this.levels[key as keyof typeof this.levels] === this.getLevel()
    );
  }

  private toLogLevelDesc(level: LogLevelDesc): loglevel.LogLevelDesc {
    if (typeof level === 'string')
      level = this.levels[level.toUpperCase() as keyof LogLevel];
    return level;
  }
  private toLogLevelName(level: LogLevelNames): loglevel.LogLevelNames {
    if (level === 'softwarn') return 'warn';
    if (level === 'softerror') return 'error';
    return level;
  }
  private toLogLevelNumber(level: LogLevelNames): loglevel.LogLevelNumbers {
    return this.levels[level.toUpperCase() as keyof LogLevel];
  }

  private shouldLog(level: LogLevelNames): boolean {
    return this.toLogLevelNumber(level) >= this.getLevel();
  }

  //
  // * Original methods
  //

  private createLogMethod(level: LogLevelNames) {
    return (...msg: any[]) => {
      if (this.shouldLog(level)) {
        loglevel[this.toLogLevelName(level)](...msg);
      }
    };
  }

  public trace = this.createLogMethod('trace');
  public debug = this.createLogMethod('debug');
  public log = this.debug;
  public info = this.createLogMethod('info');
  public warn = this.createLogMethod('warn');
  public error = this.createLogMethod('error');

  public getLogger = (name: string | symbol) => loglevel.getLogger(name);
  public getLoggers = () => loglevel.getLoggers();
  public noConflict = () => loglevel.noConflict();
  public rebuild = () => loglevel.rebuild();
  public enableAll = (persist?: boolean) => loglevel.enableAll(persist);
  public disableAll = (persist?: boolean) => loglevel.disableAll(persist);
  public resetLevel = () => loglevel.resetLevel();

  //
  // * Custom method factory
  //

  public methodFactory(
    methodName: LogLevelNames,
    level: LogLevelNumbers,
    loggerName: string | symbol
  ): loglevel.LoggingMethod {
    const rawMethod = originalFactory(
      (() => {
        // Trigger loglelvel.info for softwarn and softerror
        if (methodName == 'softwarn') return 'info';
        if (methodName == 'softerror') return 'info';
        return methodName;
      })(),
      level,
      loggerName
    );

    return (...message) => {
      let lvl = methodName;
      // If the first argument is 'softwarn' or 'softerror', change the log level
      if (
        message.length > 0 &&
        (message[0] === 'softwarn' || message[0] == 'softerror')
      ) {
        lvl = this.toLogLevelName(message[0]);
        message.shift();
      }

      // Add styling to the log level and log the rest of the messages
      let prefix = '%c' + lvl.toUpperCase();
      rawMethod(`${prefix.padStart(7)}:`, styles[lvl], ...message);
    };
  }

  public getLevel = loglevel.getLevel;

  public setLevel(level: LogLevelDesc): void {
    loglevel.setLevel(this.toLogLevelDesc(level));
    if (typeof level === 'string')
      level = this.toLogLevelNumber(level.toLowerCase() as LogLevelNames);
    if (typeof level !== 'number')
      throw new TypeError('Invalid log level', level);
    storage.local.set('loglevel', level);
  }

  public setDefaultLevel(level: LogLevelDesc): void {
    loglevel.setDefaultLevel(this.toLogLevelDesc(level));
  }

  //
  // * Custom methods
  //

  // Add methods for console.time and console.group
  public time(level: LogLevelNames, label: string) {
    if (!this.shouldLog(level)) return;
    console.time(label);
  }
  public timeEnd(level: LogLevelNames, label: string) {
    if (!this.shouldLog(level)) return;
    console.timeEnd(label);
  }
  public group(level: LogLevelNames, label: string) {
    if (!this.shouldLog(level)) return;
    console.group(label);
  }
  public groupCollapsed(level: LogLevelNames, label: string) {
    if (!this.shouldLog(level)) return;
    console.groupCollapsed(label);
  }
  public groupEnd(level: LogLevelNames) {
    if (!this.shouldLog(level)) return;
    console.groupEnd();
  }
  public softwarn(...msg: any[]) {
    this.info('softwarn', ...msg);
  }
  public softerror(...msg: any[]) {
    this.info('softerror', ...msg);
  }
}

const log = new CustomLog();
log.rebuild();
export default log;
