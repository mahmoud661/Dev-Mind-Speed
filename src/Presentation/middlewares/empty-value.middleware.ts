/**
 * @fileoverview Middleware for detecting and rejecting empty values in request body.
 * Prevents processing of requests with null, undefined, or empty string values.
 */

import { Request, Response, NextFunction } from "express";

/**
 * Express middleware that checks for empty values in request body.
 * Rejects requests containing null, undefined, or empty string values.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void}
 */
export function emptyValueMiddleware(req: Request, res: Response, next: NextFunction) {
  // Handle case where req.body is undefined or null
  if (!req.body) {
    res.status(400).json({
      error: "Empty values not allowed",
      message: "Request body is required",
      emptyFields: ["body"]
    });
    return;
  }

  /**
   * Recursively checks an object for empty values.
   * 
   * @param {Record<string, unknown>} obj - The object to check
   * @param {string} [path=""] - Current path in the object (for nested objects)
   * @returns {string[]} Array of field paths that contain empty values
   */
  const checkForEmptyValues = (obj: Record<string, unknown>, path = ""): string[] => {
    const emptyFields: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fieldPath = path ? `${path}.${key}` : key;
      
      if (value === null || value === undefined) {
        emptyFields.push(fieldPath);
      } else if (typeof value === 'string' && value.trim() === '') {
        emptyFields.push(fieldPath);
      } else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        const nestedEmpty = checkForEmptyValues(value as Record<string, unknown>, fieldPath);
        emptyFields.push(...nestedEmpty);
      }
    }
    
    return emptyFields;
  };

  if (req.body && typeof req.body === 'object') {
    const emptyFields = checkForEmptyValues(req.body as Record<string, unknown>);
    
    if (emptyFields.length > 0) {
      res.status(400).json({
        error: "Empty values not allowed",
        message: "Please provide values for all required fields",
        emptyFields: emptyFields
      });
      return;
    }
  }

  next();
}
