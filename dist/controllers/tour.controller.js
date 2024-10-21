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
class TourController {
    static findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                function getFilterOptions() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const queryObj = Object.assign({}, req.query);
                        const excludedFields = ["page", "sort", "limit", "fields"];
                        excludedFields.forEach((el) => delete queryObj[el]);
                        const queryStr = JSON.stringify(queryObj);
                        return JSON.parse(queryStr.replace(/\b(gt|gte|ls|lte)\b/g, (match) => `$${match}`));
                    });
                }
                const data = yield tour_model_1.default.find(yield getFilterOptions());
                return res.status(200).json({
                    status: "success",
                    results: data.length,
                    data,
                });
            }
            catch (err) {
                return res.status(404).json({ status: "fail", message: err });
            }
        });
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
        try {
            const data = tour_model_1.default.create(req.body);
            return res.status(201).json({
                status: "success",
                results: 1,
                data,
            });
        }
        catch (err) {
            return res.status(404).json({ status: "fail", message: err });
        }
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
}
exports.default = TourController;
