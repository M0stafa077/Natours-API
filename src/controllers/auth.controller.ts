import { Request, Response, NextFunction, RequestHandler } from "express";
import UserModel from "../models/user.model";
import catchAsync from "../utils/catchAsync";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import nodemailer from "nodemailer";
import * as crypto from "crypto";

export default class AuthController {
    static signup: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            let { name, email, password } = req.body;
            const newUser = await UserModel.create({
                name,
                email,
                password,
            });
            const accessToken = jwt.sign(
                { id: newUser._id },
                String(process.env.JWT_SECRET),
                { expiresIn: process.env.JWT_EXP_DURATION }
            );
            return res.status(201).json({
                status: "success",
                data: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                },
                accessToken,
            });
        }
    );
    static login = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            let { email, password } = req.body;
            if (!email || !password) {
                return next(
                    new AppError("Please provide email and password", 400)
                );
            }
            const user = await UserModel.findOne({ email }, [
                "password",
                "role",
            ]);
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({
                    status: "fail",
                    message: "Incorrect email or password",
                });
            }
            const accessToken = jwt.sign(
                { id: user._id, role: user.role },
                String(process.env.JWT_SECRET),
                { expiresIn: process.env.JWT_EXP_DURATION }
            );
            return res.status(200).json({ status: "success", accessToken });
        }
    );
    static authenticateMiddlewre = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            let accessToken: string | undefined;
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer")
            ) {
                accessToken = req.headers.authorization?.split(" ").at(1);
                if (!accessToken) {
                    return next(new AppError("login", 401));
                }
            }
            const payload: any = await verifyToken(
                accessToken + "",
                process.env.JWT_SECRET + ""
            );
            if (!payload) return next(new AppError("login", 401));
            const userData = await UserModel.findById(payload.id);
            if (!userData) return next(new AppError("login", 401));
            if (userData.passwordUpdateTime) {
                const lastPasswordUpdateTime =
                    userData.passwordUpdateTime.getTime() / 1000;
                if (lastPasswordUpdateTime > payload.iat) {
                    return next(new AppError("login", 401));
                }
            }
            next();
        }
    );
    static authorizeMiddleware = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const accessToken: any = req.headers.authorization
                ?.split(" ")
                .at(1);
            const payload = await verifyToken(accessToken);
            if (payload?.role !== "admin") {
                return next(
                    new AppError(
                        "Not authorized: Insufficient permissions",
                        403,
                        "Not Authorized"
                    )
                );
            }
            return next();
        }
    );
    static forgotPassword = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const email = req.body.email;
            if (!email) {
                return next(
                    new AppError("Please provide the email address", 400)
                );
            }
            const user = await UserModel.findOneAndUpdate(
                { email },
                { resetToken: null },
                { new: true }
            );
            if (!user) {
                return next(new AppError("User not found", 400));
            }
            const resetToken = user.generateResetToken();

            await user.save({ validateBeforeSave: false });
            await sendEmail(email, resetToken);
            return res.json({
                status: "success",
                message: `A reset password email is sent to ${email}`,
            });
        }
    );
    static resetPassword = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const newPassword = req.body.newPassword;
            if (!newPassword) {
                return next(
                    new AppError("Please provide the new password", 400)
                );
            }
            // Get the user with the provided reset token
            const resetToken = crypto
                .createHash("sha256")
                .update(req.params.resetToken)
                .digest("hex");
            const user = await UserModel.findOne({
                resetToken,
                resetTokenExp: { $gt: Date.now() },
            });
            if (!user) {
                return next(new AppError("Token is invalid", 400));
            }
            // reset the password and save it to db
            user.password = newPassword;
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            // Login the user
            req.body.email = user.email;
            req.body.password = newPassword;
            return this.login(req, res, next);
        }
    );
}
async function verifyToken(
    token: string,
    secret: string = process.env.JWT_SECRET + ""
) {
    try {
        const payload = await new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        return payload as {
            id: string;
            role: string;
            iat: number;
            exp: number;
        };
    } catch (err) {
        return undefined;
    }
}
async function sendEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.WEBSITE_BASE_URL}/reset-password/${resetToken}`;
    const emailTransporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: Number(process.env.MAILTRAP_PORT),
        auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASS,
        },
    });
    emailTransporter.sendMail({
        from: process.env.MAILTRAP_EMAIL,
        to: email,
        subject: "Natours Password Reset",
        text: `Visit the following link to reset your password: ${resetUrl}`,
    });
}
