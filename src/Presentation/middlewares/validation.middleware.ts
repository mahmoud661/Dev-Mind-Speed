import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass, ClassConstructor } from "class-transformer";

export function validationMiddleware<T extends object>(
  type: ClassConstructor<T>,
  skipMissingProperties = false
) {
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
