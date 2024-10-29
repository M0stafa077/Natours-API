export default class AppError extends Error {
    status: string;
    statusCode: number;
    isOperational: boolean;
    constructor(public myMessage: string, statusCode: number) {
        super(myMessage);
        this.statusCode = statusCode;
        this.status = statusCode.toString().startsWith("4") ? "error" : "fail";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
