process.on("uncaughtException", (err) =>
  console.error("uncaughtException: %o", err)
);

import dotenv from "dotenv";

dotenv.config({
  path: `./${process.env.NODE_ENV || "local"}.env`,
});

import express from "express";
import helmet from "helmet";
import cors from "cors";

import { ServerConfig } from "./src/config/serverConfig.js";
import { Middleware } from "./src/middleware/index.js";

import { MySql } from "./src/models/mysql.js";
import { Logger } from "./src/models/logger.js";

import { ExampleRouter } from "./src/routes/exampleRoute.js";

const main = async () => {
  const serverConfig = new ServerConfig();
  Logger.init(serverConfig);

  const middleware = new Middleware(serverConfig.multerConfig);

  const mysqlInstance = new MySql(serverConfig.mysqlConfig);
  await mysqlInstance.init();

  const app = express();

  app.use(helmet());
  app.use(cors());

  // allow x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true, limit: "100mb" }));
  // allow response json
  app.use(express.json({ limit: "100mb" }));
  app.use(express.static("public"));

  app.use("/api/v1/test", new ExampleRouter(middleware).router);

  app.use(function (req, res, next) {
    req.setTimeout(300000);
  });

  /**
   * Global error handler for express app.
   */
  app.use((err, req, res, next) => {
    Logger.logger.error(err.message, { stack: err.stack });
    console.log(err);
    if (err.status >= 400 && err.status <= 499) {
      res.status(err.status).json({ error: err.message });
    }
    // Other than 4xx error return 500
    else {
      res.status(500).json({ error: "Server error..." });
    }
  });

  app.listen(process.env.PORT || 3000, () => {
    Logger.logger.info(
      `backend-service is running on port ${process.env.PORT || 3000}...`
    );
  });
};

main();
