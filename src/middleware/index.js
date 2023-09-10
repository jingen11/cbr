//https:www.npmjs.com/package/multer
import multer from "multer";

export class Middleware {
  #multerUpload;

  constructor(multerConfig) {
    this.#multerUpload = multer({
      storage: multerConfig.storage,
    });
  }

  get multerUpload() {
    return this.#multerUpload;
  }

  wrapAsync(fn) {
    return function (req, res, next) {
      // Make sure to `.catch()` any errors and pass them along to the `next()`
      // middleware in the chain, in this case the error handler.
      fn(req, res, next).catch(next);
    };
  }
}
