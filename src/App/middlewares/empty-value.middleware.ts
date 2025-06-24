import { Request, Response, NextFunction } from "express";

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
