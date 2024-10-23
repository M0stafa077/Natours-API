import AppError from "../utils/AppError";
import { Request, Response, NextFunction } from "express";

function handleDevError(err: AppError, res: Response) {
    return res.status(err.statusCode).json({
        error: err,
        status: err.status,
        stack: err.stack,
        message: err.message,
    });
}
function handleProdError(err: AppError, res: Response) {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error("ERROR OCCURED ❗❗: " + err);
        return res.status(500).json({
            status: "error",
            message: "Something went wrong! please try again",
        });
    }
}
export default function globalErrorHandler(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "dev") {
        handleDevError(err, res);
    } else if (process.env.NODE_ENV === "prod") {
        handleProdError(err, res);
    }
}
