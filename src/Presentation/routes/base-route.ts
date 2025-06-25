/**
 * @fileoverview Abstract base class for Express route handlers.
 * Provides common structure and initialization pattern for route classes.
 */

import { Router } from "express";

/**
 * Abstract base class for all route handlers.
 * Provides common router setup and enforces route initialization pattern.
 * 
 * @abstract
 * @class BaseRoute
 */
export abstract class BaseRoute {
  /**
   * Express router instance for this route.
   * 
   * @type {Router}
   * @public
   */
  public router: Router;

  /**
   * Path prefix for this route.
   * Must be implemented by concrete route classes.
   * 
   * @type {string}
   * @public
   * @abstract
   */
  public abstract path: string;

  /**
   * Creates a new BaseRoute instance.
   * Initializes the Express router and calls route initialization.
   */
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  /**
   * Initializes route handlers for this route.
   * Must be implemented by concrete route classes to define specific endpoints.
   * 
   * @protected
   * @abstract
   * @returns {void}
   */
  protected abstract initRoutes(): void;
}