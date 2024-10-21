import { Request, Response } from "express";
import TourModel from "./../models/tour.model";

export default class TourController {
    static async findAll(req: Request, res: Response) {
        try {
            async function getFilterOptions() {
                const queryObj = { ...req.query };
                const excludedFields = ["page", "sort", "limit", "fields"];
                excludedFields.forEach((el) => delete queryObj[el]);
                const queryStr = JSON.stringify(queryObj);
                return JSON.parse(
                    queryStr.replace(
                        /\b(gt|gte|ls|lte)\b/g,
                        (match) => `$${match}`
                    )
                );
            }
            const data = await TourModel.find(await getFilterOptions());
            return res.status(200).json({
                status: "success",
                results: data.length,
                data,
            });
        } catch (err) {
            return res.status(404).json({ status: "fail", message: err });
        }
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
    static createTour(req: Request, res: Response) {
        try {
            const data = TourModel.create(req.body);
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
