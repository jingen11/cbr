import winston from "winston";

export class Logger {
  static #logger;

  static init(config) {
    this.#logger = winston.createLogger({
      level: config.level,
      defaultMeta: config.defaultMeta,
      transports: config.transports,
      exitOnError: config.exitOnError,
    });

    this.#logger.error = (err) => {
      if (err instanceof Error) {
        this.#logger.log({ level: "error", message: `${err.stack || err}` });
      } else {
        this.#logger.log({ level: "error", message: err });
      }
    };
  }

  /**
   * @returns {winston.Logger}
   */
  static get logger() {
    return this.#logger;
  }
}
