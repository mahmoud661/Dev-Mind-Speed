import { Request, Response, NextFunction } from "express";

export function sanitizeInputMiddleware(req: Request, res: Response, next: NextFunction) {
  // Remove leading/trailing whitespace from string values
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
