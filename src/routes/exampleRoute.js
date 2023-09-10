import { BaseRoute } from "./baseRoute.js";

export class ExampleRouter extends BaseRoute {
  constructor(middleware) {
    super(middleware);

    const { multerUpload, wrapAsync } = this.middleware;

    this.router.post("/upload", multerUpload.single("image"), (req, res) => {
      console.log(req.file);
      return res.json({ succes: true });
    });

    this.router.get("/", (req, res) => {
      return res.json({ success: true });
    });

    this.router.post("/", (req, res) => {
      console.log(req.body);

      return res.json({ success: true });
    });
  }
}
