import { NextFunction, Request, Response } from "express";
import * as AuthService from "../services/Auth";

export default class AuthController {
  // @desc Auth user return token and user object
  // @route POST /api/v1/user/login
  // @access Public
  public static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return AuthService.loginService(req, res, next);
  }

  // @desc Auth user return token and user object
  // @route POST /api/v1/user/register
  // @access Public
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return AuthService.registerService(req, res, next);
  }

  // @desc Verify user email
  // @route POST /api/v1/user/verify-email
  // @access Privet
  public static async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return AuthService.verifyEmailService(req, res, next);
  }

  // @desc Resend email verification Link
  // @route POST /api/v1/user/resend-email-verification
  // @access Public
  public static async resendEmailVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return AuthService.resendEmailVerificationService(req, res, next);
  }
}
