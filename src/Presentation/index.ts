import express, { Application } from "express";
import { errorHandlerMiddleware } from "./middlewares";
import { RouteRegistry } from "./RouteRegistry";

export class AppServer {
  public app: Application;
  private routeRegistry: RouteRegistry;
  private readonly apiPrefix = "/api/v1";
  
  constructor() {
    this.app = express();
    this.routeRegistry = new RouteRegistry(this.app, this.apiPrefix);
    this.setupMiddleware();
  }

  private setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private async setupRoutes() {
    await this.routeRegistry.registerRoutes();
  }

  public async listen(port: number): Promise<void> {
    await this.setupRoutes();
    // Error handler middleware must be the last middleware
    this.app.use(errorHandlerMiddleware);
    
    this.app.listen(port, () =>
      console.log(`🚀 Server running at http://localhost:${port}`)
    );
  }
}
