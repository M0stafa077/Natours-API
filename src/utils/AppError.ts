export default class AppError extends Error {
    status: string;
    statusCode: number;
    constructor(errorMsg: string, statusCode: number) {
        super(errorMsg);
        this.statusCode = statusCode;
        this.status = statusCode.toString().startsWith("4") ? "error" : "fail";
        Error.captureStackTrace(this, this.constructor);
    }
}
