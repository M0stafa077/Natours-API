import express, { NextFunction } from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import morgan from "morgan";
import globalErrorHandler from "./controllers/error.controller";
import AppError from "./utils/AppError";
import toursRouter from "./routes/tour.routes";
import userRouter from "./routes/user.routes";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

process.on("uncaughtException", (err: Error) => {
    console.log("UNHANDLED REJECTION ❗❗");
    console.error(err);
    process.exit(1);
});
const app = express();
app.use(express.json());
if (process.env.NODE_ENV === "dev") {
    app.use(morgan("dev"));
}
const db: string =
    process.env.DATABASE?.replace(
        "<PASSWORD>",
        String(process.env.DATABASE_PASSWORD)
    ) + "";

mongoose
    .connect(db)
    .then(() => console.log("DATABASE CONNECTED!! "))
    .catch((err) => console.log(err));

app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to Natours-API" });
});
app.get("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError("Can't find this page", 404));
});
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err: Error) => {
    console.error(err.name, "\n", err.message);
    console.log("UNHANDLED REJECTION ❗❗");

    server.close(() => {
        process.exit(1);
    });
});
