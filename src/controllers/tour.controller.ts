import { Request, Response, NextFunction, RequestHandler } from "express";
import TourModel from "./../models/tour.model";
import APIFeatures from "../utils/ApiFeatures";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

export default class TourController {
    static findAll: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const apiFeatures = new APIFeatures(TourModel.find(), req.query);
            const features = apiFeatures
                .filter()
                .sort()
                .limitFields()
                .paginate();
            const data = await features.dbQuery;
            return res.status(200).json({
                status: "success",
                results: (data as []).length,
                data,
            });
        }
    );
    static topToursMiddleware(req: Request, res: Response, next: NextFunction) {
        req.query.limit = "5";
        req.query.sort = "-ratingsAverage,price";
        next();
    }
    static findOne: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const data = await TourModel.findById(req.params.id);
            if (!data) {
                return next(
                    new AppError(`No tour found with id: ${req.params.id}`, 404)
                );
            }
            return res.status(200).json({
                status: "success",
                results: 1,
                data,
            });
        }
    );
    static createTour: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const data = await TourModel.create(req.body);
            if (!data) {
                return next(new AppError("No tour found with this ID", 404));
            }
            return res.status(201).json({
                status: "success",
                results: 1,
                data,
            });
        }
    );
    static updateTour: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const data = await TourModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );
            if (!data) {
                return next(
                    new AppError(`No tour found with id: ${req.params.id}`, 404)
                );
            }
            return res
                .status(200)
                .json({ status: "success", results: 1, data });
        }
    );
    static deleteTour: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const data = await TourModel.findByIdAndDelete(req.params.id, {
                new: true,
                runValidators: true,
            });
            if (!data) {
                return next(
                    new AppError(`No tour found with id: ${req.params.id}`, 404)
                );
            }
            return res.status(204).json({ status: "success", data: {} });
        }
    );
    static getToursStats: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const stats = await TourModel.aggregate([
                {
                    $match: { ratingsAverage: { $gte: 4.5 } },
                },
                {
                    $group: {
                        // Match the result (GROUP BY)
                        _id: { $toUpper: "$difficulty" },
                        toursCount: { $sum: 1 },
                        avgRating: { $avg: "$ratingsAverage" },
                        numRatings: { $sum: "$ratingsQuantity" },
                        avgPrice: { $avg: "$price" },
                        minPrice: { $min: "$price" },
                        maxPrice: { $max: "$price" },
                    },
                },
                {
                    $sort: { avgPrice: 1 },
                },
            ]);
            return res.status(200).json({
                status: "success",
                results: stats.length,
                data: stats,
            });
        }
    );
}
