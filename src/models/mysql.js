import mysql from "mysql2/promise";

export class MySql {
  #connection;
  #pool;

  /**
   *
   * @param {{host: String | null, port: Number | null, user: String, password: String, database: String, socketPath: String | null}} config
   */
  constructor(config) {
    this.#pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      timezone: "+00:00",
      socketPath: config.socketPath,
    });
  }

  async init() {
    this.#connection = await this.#pool.getConnection();
  }

  /**
   *
   * @param {String} statement
   * @param {Array} args
   * @param {Boolean} prepared
   * @returns {Promise}
   */
  async query(statement, args = []) {
    if (args.length > 0) {
      return this.#connection.execute(statement, args);
    } else {
      return this.#connection.query(statement);
    }
  }
}
