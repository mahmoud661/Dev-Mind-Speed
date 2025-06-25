/**
 * @fileoverview Validation middleware using class-validator for request validation.
 * Provides automatic validation of request DTOs using decorators.
 */

import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass, ClassConstructor } from "class-transformer";

/**
 * Creates a validation middleware for the specified DTO class.
 * Validates request body against the DTO class using class-validator decorators.
 * 
 * @template T - The DTO class type to validate against
 * @param {ClassConstructor<T>} type - The DTO class constructor
 * @param {boolean} [skipMissingProperties=false] - Whether to skip validation of missing properties
 * @returns {Function} Express middleware function for validation
 */
export function validationMiddleware<T extends object>(
  type: ClassConstructor<T>,
  skipMissingProperties = false
) {
  /**
   * Express middleware function that validates request body.
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object  
   * @param {NextFunction} next - Express next function
   * @returns {Promise<void>} Promise that resolves when validation is complete
   */
  return async (req: Request, res: Response, next: NextFunction) => {
    // Handle case where req.body is undefined or null
    if (!req.body) {
      res.status(400).json({
        error: "Validation failed",
        message: "Request body is required",
        details: []
      });
      return;
    }

    const dto = plainToClass(type, req.body);
    const errors: ValidationError[] = await validate(dto, {
      skipMissingProperties,
      whitelist: true,
      forbidNonWhitelisted: true
    });

    if (errors.length > 0) {
      const errorMessages = errors.map(error => ({
        property: error.property,
        value: error.value,
        constraints: error.constraints || {},
        children: error.children
      }));

      res.status(400).json({
        error: "Validation failed",
        message: "Please check your input data",
        details: errorMessages
      });
      return;
    }

    // Attach the validated DTO to the request for use in controllers
    req.body = dto;
    next();
  };
}
