import { Request, Response, NextFunction } from "express";
import TourModel from "./../models/tour.model";
import APIFeatures from "../utils/apiFeatures";

export default class TourController {
    static async findAll(req: Request, res: Response) {
        try {
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
        } catch (err) {
            console.error(err);
            return res
                .status(404)
                .json({ status: "fail", message: String(err) });
        }
    }
    static topToursMiddleware(req: Request, res: Response, next: NextFunction) {
        req.query.limit = "5";
        req.query.sort = "-ratingsAverage,price";
        next();
    }
    static async findOne(req: Request, res: Response) {
        try {
            const data = await TourModel.findById(req.params.id);
            return res.status(200).json({
                status: "success",
                results: 1,
                data,
            });
        } catch (err) {
            return res.status(404).json({ status: "fail", message: err });
        }
    }
    static async createTour(req: Request, res: Response) {
        try {
            const data = await TourModel.create(req.body);
            return res.status(201).json({
                status: "success",
                results: 1,
                data,
            });
        } catch (err) {
            return res.status(404).json({ status: "fail", message: err });
        }
    }
    static async updateTour(req: Request, res: Response) {
        try {
            const data = await TourModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );
            return res
                .status(200)
                .json({ status: "success", results: 1, data });
        } catch (err) {
            return res.status(404).json({ status: "fail", message: err });
        }
    }
    static async deleteTour(req: Request, res: Response) {
        try {
            const data = await TourModel.findByIdAndDelete(req.params.id, {
                new: true,
                runValidators: true,
            });
            return res.status(204).json({ status: "success", data: {} });
        } catch (err) {
            return res.status(404).json({ status: "fail", message: err });
        }
    }
}
