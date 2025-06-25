/**
 * @fileoverview Express application server setup and configuration.
 * Main server class handling Express app initialization, middleware setup, and routing.
 */

import express, { Application } from "express";
import { errorHandlerMiddleware } from "./middlewares";
import { RouteRegistry } from "./RouteRegistry";

/**
 * Main application server class.
 * Configures Express application with middleware, routes, and error handling.
 * 
 * @class AppServer
 */
export class AppServer {
  /**
   * Express application instance.
   * 
   * @public
   * @type {Application}
   */
  public app: Application;

  /**
   * Route registry for automatic route discovery.
   * 
   * @private
   * @type {RouteRegistry}
   */
  private routeRegistry: RouteRegistry;

  /**
   * API version prefix for all routes.
   * 
   * @private
   * @readonly
   * @type {string}
   */
  private readonly apiPrefix = "/api/v1";
  
  /**
   * Creates a new AppServer instance.
   * Initializes Express app, route registry, and sets up middleware.
   */
  constructor() {
    this.app = express();
    this.routeRegistry = new RouteRegistry(this.app, this.apiPrefix);
    this.setupMiddleware();
  }

  /**
   * Sets up Express middleware for request parsing.
   * 
   * @private
   * @returns {void}
   */
  private setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  /**
   * Sets up application routes using the route registry.
   * 
   * @async
   * @private
   * @returns {Promise<void>} Promise that resolves when routes are set up
   */
  private async setupRoutes() {
    await this.routeRegistry.registerRoutes();
  }

  /**
   * Starts the HTTP server on the specified port.
   * Sets up routes and error handling before starting the server.
   * 
   * @async
   * @public
   * @param {number} port - Port number to listen on
   * @returns {Promise<void>} Promise that resolves when server is started
   */
  public async listen(port: number): Promise<void> {
    await this.setupRoutes();
    // Error handler middleware must be the last middleware
    this.app.use(errorHandlerMiddleware);
    
    this.app.listen(port, () =>
      console.log(`🚀 Server running at http://localhost:${port}`)
    );
  }
}
