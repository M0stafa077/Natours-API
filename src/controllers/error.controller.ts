import AppError from "../utils/AppError";
import { Request, Response, NextFunction } from "express";
import { CastError, Error as MongooseError } from "mongoose";
import mongoose from "mongoose";

interface DuplicateKeyError extends MongooseError {
    keyPattern: Record<string, any>;
    errmsg?: string;
    errorResponse?: any;
}

function handleDBCastingError(err: CastError): AppError {
    const errMessage = `Invalid ${err.path}: ${err.value}`;
    return new AppError(errMessage, 400);
}
function handleDBDuplicateEntry(err: DuplicateKeyError) {
    const duplicatedField = String(Object.keys(err?.keyPattern)[0]);
    const duplicatedValue = String(err.errorResponse?.errmsg).match(/"(.*?)"/);
    const errMessage = `Duplicate entry for field: ${duplicatedField}, with value: ${duplicatedValue?.[1]}`;
    return new AppError(errMessage, 400);
}
function handleDBValidationErrors(err: mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    return new AppError(errors.join(". "), 400);
}
function handleFaliedLoginError(): AppError {
    return new AppError("Please login first", 401);
}
function handleDevError(err: AppError, res: Response) {
    return res.status(err.statusCode).json({
        message: err.myMessage,
        error: err,
        status: err.status,
        stack: err.stack,
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
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "dev") {
        handleDevError(err, res);
        console.log("DEV ERROR 💥");
    } else if (process.env.NODE_ENV === "prod") {
        console.log("PRODUCTION ERROR 💥");
        let error: any = { ...err };
        if (err.name === "CastError") {
            error = handleDBCastingError(error);
        } else if (err.code === 11000) {
            error = handleDBDuplicateEntry(error);
        } else if (err?.myMessage === "Validation failed") {
            error = handleDBValidationErrors(error);
        } else if (err?.myMessage === "login") {
            error = handleFaliedLoginError();
        }
        handleProdError(error, res);
    }
}
