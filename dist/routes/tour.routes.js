"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tour_controller_1 = __importDefault(require("../controllers/tour.controller"));
const router = (0, express_1.Router)();
router
    .route("/top-5-cheapest")
    .get(tour_controller_1.default.topToursMiddleware, tour_controller_1.default.findAll);
router.route("/").get(tour_controller_1.default.findAll).post(tour_controller_1.default.createTour);
router
    .route("/:id")
    .get(tour_controller_1.default.findOne)
    .patch(tour_controller_1.default.updateTour)
    .delete(tour_controller_1.default.deleteTour);
exports.default = router;
