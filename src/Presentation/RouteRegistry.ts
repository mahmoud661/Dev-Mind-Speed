import { Application } from "express";
import { glob } from "glob";
import path from "path";
import { BaseRoute } from "./routes/base-route";

export class RouteRegistry {
  private app: Application;
  private apiPrefix: string;

  constructor(app: Application, apiPrefix: string = "/api/v1") {
    this.app = app;
    this.apiPrefix = apiPrefix;
  }

  /**
   * Registers all routes from the routes directory
   */
  public async registerRoutes(): Promise<void> {
    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.status(200).json({ 
        status: "OK", 
        message: "Dev Mind Speed API is running" 
      });
    });

    await this.loadRouteFiles();
  }

  /**
   * Dynamically loads and registers route files
   */
  private async loadRouteFiles(): Promise<void> {
    const routeFiles = await glob(
      path.resolve(__dirname, "routes/*.ts").replace(/\\/g, "/")
    );

    for (const filePath of routeFiles) {
      await this.registerRouteFromFile(filePath);
    }
  }

  /**
   * Registers a route from a specific file
   */
  private async registerRouteFromFile(filePath: string): Promise<void> {
    try {
      const module = await import(filePath);
      
      for (const exportedName in module) {
        const RouteClass = module[exportedName];
        
        if (this.isValidRouteClass(RouteClass)) {
          const routeInstance: BaseRoute = new RouteClass();
          
          this.app.use(
            `${this.apiPrefix}${routeInstance.path}`,
            routeInstance.router
          );
          
          console.log(`✅ Loaded route: ${routeInstance.path}`);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to load route from ${filePath}:`, error);
    }
  }

  /**
   * Validates if a class is a valid route class extending BaseRoute
   */
  private isValidRouteClass(RouteClass: unknown): boolean {
    return (
      typeof RouteClass === "function" &&
      Object.getPrototypeOf(RouteClass).name === "BaseRoute"
    );
  }

  /**
   * Registers a single route instance manually
   */
  public registerRoute(route: BaseRoute): void {
    this.app.use(
      `${this.apiPrefix}${route.path}`,
      route.router
    );
    console.log(`✅ Manually registered route: ${route.path}`);
  }
}
