import { Request, Response, NextFunction } from "express";

export const responseInterceptor = (
  req: Request,
  res: any,
  next: NextFunction
) => {
  const originalJson = res.json;

  res.json = function (data: any) {
    if (res.statusCode >= 400) {
      const response = {
        success: false,
        error: typeof data === "string" ? { message: data } : data,
        timestamp: new Date().toISOString(),
      };
      originalJson.call(this, response);
    } else {
      const response = {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
      originalJson.call(this, response);
    }
  };

  next();
};
