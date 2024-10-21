import { Router } from "express";
import TourController from "../controllers/tour.controller";
const router = Router();

router.route("/").get(TourController.findAll).post(TourController.createTour);
router
    .route("/:id")
    .get(TourController.findOne)
    .patch(TourController.updateTour)
    .delete(TourController.deleteTour);

export default router;
