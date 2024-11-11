import { Router } from "express";
import UserController from "../controllers/user.controller";
import AuthController from "../controllers/auth.controller";

const router = Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);

router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password/:resetToken", AuthController.resetPassword);

router
    .use(
        AuthController.authenticateMiddlewre,
        AuthController.authorizeMiddleware
    )
    .route("/")
    .get(UserController.getAllUsers)
    .post(UserController.createUser);

router
    .route("/:id")
    .get(AuthController.authenticateMiddlewre, UserController.getUserById)
    .patch(AuthController.authenticateMiddlewre, UserController.updateUser)
    .delete(
        AuthController.authenticateMiddlewre,
        AuthController.authorizeMiddleware,
        UserController.deleteUser
    );

export default router;
