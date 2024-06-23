import cors from "cors";
import express from "express";

export default class Server {
  #app;
  #port;
  #host;
  #server;
  #routers;

  constructor(port, host, routers) {
    this.#app = express();
    this.#port = port;
    this.#host = host;
    this.#server = null;
    this.#routers = routers;
  }

  getApp = () => {
    return this.#app;
  };

  start = async () => {
    console.log("Starting server on port " + this.#port);

    this.#app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      })
    );

    this.#app.use(express.json());

    try {
      this.#routers.forEach((router) => {
        this.#app.use(router.path, router.router);
      });

      this.#server = this.#app.listen(this.#port, this.#host, () => {
        console.log(
          `Server is listening on http://${this.#host}:${this.#port}`
        );
      });
    } catch (e) {
      console.error("Failed to start server:", e);
      process.exit(1);
    }
  };

  close = async () => {
    this.#server?.close();
  };
}
