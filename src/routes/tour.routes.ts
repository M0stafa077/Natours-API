import { Router } from "express";
import TourController from "../controllers/tour.controller";
const router = Router();

router
    .route("/top-5-cheapest")
    .get(TourController.topToursMiddleware, TourController.findAll);
router.route("/").get(TourController.findAll).post(TourController.createTour);
router.route("/stats").get(TourController.getToursStats);
router
    .route("/:id")
    .get(TourController.findOne)
    .patch(TourController.updateTour)
    .delete(TourController.deleteTour);

export default router;
