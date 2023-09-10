import express from "express";

import { Middleware } from "../middleware/index.js";

export class BaseRoute {
  #middleware;
  #router = express.Router();

  /**
   *
   * @param {Middleware} middleware
   */
  constructor(middleware) {
    this.#middleware = middleware;
  }

  get middleware() {
    return this.#middleware;
  }

  get router() {
    return this.#router;
  }
}
