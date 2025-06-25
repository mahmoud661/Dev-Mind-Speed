/**
 * @fileoverview Route registry for automatic route discovery and registration.
 * Dynamically loads and registers route handlers from the routes directory.
 */

import { Application } from "express";
import { glob } from "glob";
import path from "path";
import { BaseRoute } from "./routes/base-route";

/**
 * Registry class for automatic route discovery and registration.
 * Scans the routes directory and registers all route classes extending BaseRoute.
 * 
 * @class RouteRegistry
 */
export class RouteRegistry {
  /**
   * Express application instance.
   * 
   * @private
   * @type {Application}
   */
  private app: Application;

  /**
   * API prefix for all registered routes.
   * 
   * @private
   * @type {string}
   */
  private apiPrefix: string;

  /**
   * Creates a new RouteRegistry instance.
   * 
   * @param {Application} app - Express application instance
   * @param {string} [apiPrefix="/api/v1"] - Prefix for all API routes
   */
  constructor(app: Application, apiPrefix: string = "/api/v1") {
    this.app = app;
    this.apiPrefix = apiPrefix;
  }

  /**
   * Registers all routes from the routes directory.
   * Sets up health check endpoint and dynamically loads route files.
   * 
   * @async
   * @public
   * @returns {Promise<void>} Promise that resolves when all routes are registered
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
   * Dynamically loads and registers route files from the routes directory.
   * 
   * @async
   * @private
   * @returns {Promise<void>} Promise that resolves when all route files are loaded
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
   * Registers a route from a specific file.
   * Imports the module and registers all valid route classes found.
   * 
   * @async
   * @private
   * @param {string} filePath - Path to the route file to load
   * @returns {Promise<void>} Promise that resolves when the route is registered
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
   * Validates if a class is a valid route class extending BaseRoute.
   * 
   * @private
   * @param {unknown} RouteClass - The class to validate
   * @returns {boolean} True if the class extends BaseRoute, false otherwise
   */
  private isValidRouteClass(RouteClass: unknown): boolean {
    return (
      typeof RouteClass === "function" &&
      Object.getPrototypeOf(RouteClass).name === "BaseRoute"
    );
  }

  /**
   * Registers a single route instance manually.
   * Used for programmatic route registration outside of file discovery.
   * 
   * @public
   * @param {BaseRoute} route - The route instance to register
   * @returns {void}
   */
  public registerRoute(route: BaseRoute): void {
    this.app.use(
      `${this.apiPrefix}${route.path}`,
      route.router
    );
    console.log(`✅ Manually registered route: ${route.path}`);
  }
}
