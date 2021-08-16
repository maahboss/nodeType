import express from "express";
import AuthController from "../controllers/AuthController";
import { checkEmailFromToken } from "../middleware/checkJWT";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post(
  "/resend-email-verification",
  AuthController.resendEmailVerification
);
router.put(
  "/verify-email/:token",
  checkEmailFromToken,
  AuthController.verifyEmail
);

export { router as authRouter };
