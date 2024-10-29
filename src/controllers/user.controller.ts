import { RequestHandler, Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import UserModel from "../models/user.model";
import APIFeatures from "../utils/ApiFeatures";
import AppError from "../utils/AppError";

export default class UserController {
    static getAllUsers: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const apiFeatures = new APIFeatures(
                UserModel.find().select("-password -__v"),
                req.query
            );
            const features = apiFeatures
                .filter()
                .sort()
                .limitFields()
                .paginate();
            const data = await features.dbQuery;
            return res.status(200).json({
                status: "success",
                results: data.length,
                data,
            });
        }
    );
    static getUserById: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const data = await UserModel.findById(req.params.id).select(
                "-password -__v"
            );
            if (!data) {
                return next(
                    new AppError(`No user with id = ${req.params.id}`, 404)
                );
            }
            return res.status(200).json({ status: "success", data });
        }
    );
    static createUser: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const newUser = await UserModel.create({
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
            });
            return res.status(201).json({
                status: "success",
                data: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                },
            });
        }
    );
    static updateUser: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const data = await UserModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).select("-password -__v");
            if (!data) {
                return next(
                    new AppError(`No user with id = ${req.params.id}`, 404)
                );
            }
            return res.status(200).json({ status: "success", data });
        }
    );
    static deleteUser: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const data = await UserModel.findByIdAndDelete(req.params.id, {
                new: true,
                runValidators: true,
            }).select("-password -__v");
            if (!data) {
                return next(
                    new AppError(`No user with id = ${req.params.id}`, 404)
                );
            }
            return res.status(204).json({ status: "succes", data });
        }
    );
}
