import express, { Application } from "express";
import { BaseRoute } from "./routes/base-route";
import { glob } from "glob";
import path from "path";
import { errorHandlerMiddleware } from "../App/middlewares";
import { createServer, Server as HttpServer } from "http";

export class AppServer {
  public app: Application;
  public httpServer: HttpServer;
  private readonly apiPrefix = "/api/v1";
  
  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.setupMiddleware();
  }

  private setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private async setupRoutes() {
    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.status(200).json({ status: "OK", message: "Dev Mind Speed API is running" });
    });

    const routeFiles = await glob(
      path.resolve(__dirname, "routes/*.ts").replace(/\\/g, "/")
    );

    for (const filePath of routeFiles) {
      const module = await import(filePath);
      for (const exportedName in module) {
        const RouteClass = module[exportedName];
        if (
          typeof RouteClass === "function" &&
          Object.getPrototypeOf(RouteClass).name === "BaseRoute"
        ) {
          const routeInstance: BaseRoute = new RouteClass();
          this.app.use(
            `${this.apiPrefix}${routeInstance.path}`,
            routeInstance.router
          );
          console.log(`✅ Loaded route: ${routeInstance.path}`);
        }
      }
    }
  }

  public async listen(port: number): Promise<void> {
    await this.setupRoutes();
    // Error handler middleware must be the last middleware
    this.app.use(errorHandlerMiddleware);
    
    this.httpServer.listen(port, () =>
      console.log(`🚀 Server running at http://localhost:${port}`)
    );
  }
}
