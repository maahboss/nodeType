import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { IRequest } from "../lib/Request";
import MainRepository from "../repositories/MainRepository";
import { Status } from "../types/user";
import ResponseTemplate from "../lib/response";
import { NOT_AUTHORIZED_STATUS_CODE } from "../constants/constants";
import expressAsyncHandler from "express-async-handler";

export const protectRoutes = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const secret: string = process.env.TOKEN_SECRET!;
        const jwtPayload = jwt.verify(token, secret) as JwtPayload;

        req.user = await MainRepository.findUserById(jwtPayload.payload);

        if (req.user.status === Status.NOT_VERIFIED) {
          return res
            .status(NOT_AUTHORIZED_STATUS_CODE)
            .json(ResponseTemplate.userEmailNotVerified());
        }
        if (req.user.status === Status.DEACTIVATED) {
          return res
            .status(NOT_AUTHORIZED_STATUS_CODE)
            .json(ResponseTemplate.userAccountDeactivated());
        }
        next();
      } catch (error) {
        res
          .status(NOT_AUTHORIZED_STATUS_CODE)
          .json(ResponseTemplate.userNotAuthorized());
      }
    }

    if (!token) {
      res
        .status(NOT_AUTHORIZED_STATUS_CODE)
        .json(ResponseTemplate.userNotAuthorized());
    }
  }
);

export const checkEmailFromToken = expressAsyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.params.token) {
      try {
        token = req.params.token;
        const secret: string = process.env.TOKEN_SECRET!;
        const jwtPayload = jwt.verify(token, secret) as JwtPayload;

        req.email = jwtPayload.payload;

        next();
      } catch (error) {
        res
          .status(NOT_AUTHORIZED_STATUS_CODE)
          .json(ResponseTemplate.userNotAuthorized());
      }
    }

    if (!token) {
      res
        .status(NOT_AUTHORIZED_STATUS_CODE)
        .json(
          ResponseTemplate.error(
            "Invalid verification link",
            "The verification link expired, please request a new verification email",
            NOT_AUTHORIZED_STATUS_CODE
          )
        );
    }
  }
);
