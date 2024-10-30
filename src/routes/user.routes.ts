import { Router } from "express";
import UserController from "../controllers/user.controller";
import AuthController from "../controllers/auth.controller";

const router = Router();

router.use(
    AuthController.checkAuthenticationMiddlewre,
    AuthController.checkAuthorizationMiddleware
);

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);

router
    .route("/")
    .get(UserController.getAllUsers)
    .post(UserController.createUser);

router
    .route("/:id")
    .get(UserController.getUserById)
    .patch(UserController.updateUser)
    .delete(UserController.deleteUser);

export default router;
