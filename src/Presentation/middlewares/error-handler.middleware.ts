import { Request, Response, NextFunction } from "express";

export function errorHandlerMiddleware(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  console.error(`Error occurred: ${error.message}`, {
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    res.status(400).json({
      error: "Validation Error",
      message: error.message
    });
    return;
  }

  if (error.name === 'UnauthorizedError') {
    res.status(401).json({
      error: "Unauthorized",
      message: "Access denied"
    });
    return;
  }

  if (error.name === 'NotFoundError') {
    res.status(404).json({
      error: "Not Found",
      message: error.message
    });
    return;
  }

  // Default error response
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'development' ? error.message : "Something went wrong"
  });
}
