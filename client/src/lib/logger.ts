export const logger = {
  debug: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug(...args);
    }
  },
  info: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.info(...args);
  },
  error: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error(...args);
  },
};

export default logger;
