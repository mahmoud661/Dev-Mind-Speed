/**
 * @fileoverview Sanitization middleware for cleaning user input.
 * Removes leading/trailing whitespace from string values in request body.
 */

import { Request, Response, NextFunction } from "express";

/**
 * Express middleware that sanitizes input by removing leading/trailing whitespace.
 * Recursively processes objects and arrays to clean all string values.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void}
 */
export function sanitizeInputMiddleware(req: Request, res: Response, next: NextFunction) {
  /**
   * Recursively sanitizes an object by trimming string values.
   * 
   * @param {unknown} obj - The object to sanitize
   * @returns {unknown} The sanitized object
   */
  const sanitizeObject = (obj: unknown): unknown => {
    if (typeof obj === 'string') {
      return obj.trim();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj !== null && typeof obj === 'object') {
      const sanitized: Record<string, unknown> = {};
      const objRecord = obj as Record<string, unknown>;
      for (const key in objRecord) {
        if (Object.prototype.hasOwnProperty.call(objRecord, key)) {
          sanitized[key] = sanitizeObject(objRecord[key]);
        }
      }
      return sanitized;
    }
    
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  next();
}
