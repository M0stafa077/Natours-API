import AppError from "../utils/AppError";
import { Request, Response, NextFunction } from "express";

export default function globalErrorHandler(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
}
