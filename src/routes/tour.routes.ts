import { Router } from "express";
import TourController from "../controllers/tour.controller";
import AuthController from "../controllers/auth.controller";
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
    .delete(
        AuthController.authenticateMiddlewre,
        AuthController.authorizeMiddleware,
        TourController.deleteTour
    );

export default router;
