"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tour_model_1 = __importDefault(require("./../models/tour.model"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
class TourController {
    static findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiFeatures = new apiFeatures_1.default(tour_model_1.default.find(), req.query);
                const features = apiFeatures
                    .filter()
                    .sort()
                    .limitFields()
                    .paginate();
                const data = yield features.dbQuery;
                return res.status(200).json({
                    status: "success",
                    results: data.length,
                    data,
                });
            }
            catch (err) {
                console.error(err);
                return res
                    .status(404)
                    .json({ status: "fail", message: String(err) });
            }
        });
    }
    static topToursMiddleware(req, res, next) {
        req.query.limit = "5";
        req.query.sort = "-ratingsAverage,price";
        next();
    }
    static findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield tour_model_1.default.findById(req.params.id);
                return res.status(200).json({
                    status: "success",
                    results: 1,
                    data,
                });
            }
            catch (err) {
                return res.status(404).json({ status: "fail", message: err });
            }
        });
    }
    static createTour(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield tour_model_1.default.create(req.body);
                return res.status(201).json({
                    status: "success",
                    results: 1,
                    data,
                });
            }
            catch (err) {
                return res.status(404).json({ status: "fail", message: err });
            }
        });
    }
    static updateTour(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield tour_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true,
                });
                return res
                    .status(200)
                    .json({ status: "success", results: 1, data });
            }
            catch (err) {
                return res.status(404).json({ status: "fail", message: err });
            }
        });
    }
    static deleteTour(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield tour_model_1.default.findByIdAndDelete(req.params.id, {
                    new: true,
                    runValidators: true,
                });
                return res.status(204).json({ status: "success", data: {} });
            }
            catch (err) {
                return res.status(404).json({ status: "fail", message: err });
            }
        });
    }
    static getToursStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield tour_model_1.default.aggregate([
                    {
                        $match: { ratingsAverage: { $gte: 4.5 } },
                    },
                    {
                        $group: {
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
            catch (err) {
                return res.status(404).json({ status: "fail", message: err });
            }
        });
    }
}
exports.default = TourController;
