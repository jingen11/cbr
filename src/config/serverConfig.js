import fs from "fs";

import multer from "multer";
import winston from "winston";

export class ServerConfig {
  #isProd;
  #isDev;
  #isLocal;
  #mysqlConfig;
  #multerConfig;
  #winstonConfig;

  constructor() {
    this.#isProd = process.env.NODE_ENV === "production";
    this.#isDev = process.env.NODE_ENV === "development";
    this.#isLocal = process.env.NODE_ENV === "local";

    this.#initMysqlConfig();
    this.#initMulterConfig();
    this.#initWinstonCofig();
  }

  #initMysqlConfig() {
    this.#mysqlConfig = this.#isLocal
      ? {
          host: process.env.MYSQL_HOST,
          port: process.env.MYSQL_PORT,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DB,
        }
      : this.#isDev
      ? {
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DB,
          socketPath: process.env.MYSQL_SOCKET_PATH,
        }
      : this.#isProd
      ? {
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DB,
          socketPath: process.env.MYSQL_SOCKET_PATH,
        }
      : {};
  }

  #initMulterConfig() {
    this.#multerConfig = this.#isLocal
      ? {
          storage: multer.diskStorage({
            destination: function (req, file, cb) {
              const tempFilePath = "./temp";

              fs.access("", fs.constants.F_OK, (err) => {
                if (err) {
                  fs.mkdir(tempFilePath, { recursive: true }, (err) => {
                    if (err) {
                      throw err;
                    }

                    cb(null, tempFilePath);
                  });
                }
              });
            },
            filename: function (req, file, cb) {
              const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
              cb(null, file.fieldname + "-" + uniqueSuffix);
            },
          }),
        }
      : this.#isDev
      ? {
          storage: multer.memoryStorage(),
        }
      : this.#isProd
      ? {
          storage: multer.memoryStorage(),
        }
      : {};
  }

  #initWinstonCofig() {
    this.#winstonConfig = this.#isLocal
      ? {
          level: "debug",
          defaultMeta: { service: "backend" },
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.prettyPrint()
              ),
            }),
          ],
          exitOnError: false,
        }
      : this.#isDev
      ? {
          level: "info",
          defaultMeta: { service: "backend" },
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            }),
          ],
          exitOnError: false,
        }
      : this.#isProd
      ? {
          level: "info",
          defaultMeta: { service: "backend" },
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            }),
          ],
          exitOnError: false,
        }
      : {};
  }

  get isProd() {
    return this.#isProd;
  }

  get isDev() {
    return this.#isDev;
  }

  get isLocal() {
    return this.#isLocal;
  }

  get mysqlConfig() {
    return this.#mysqlConfig;
  }

  get multerConfig() {
    return this.#multerConfig;
  }

  get winstonConfig() {
    return this.#winstonConfig;
  }
}
