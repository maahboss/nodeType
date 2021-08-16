import { Request, Response } from "express";
import generateJsonWebToken from "../../lib/generateJsonWebToken";
import { validator } from "../../validation/validator";
import { sendEmailVerificationSchema } from "../../validation/Auth";
import {
  BAD_REQUEST_STATUS_CODE,
  SUCCESS_RESPONSE_STATUS_CODE,
} from "../../constants/constants";
import ResponseTemplate from "../../lib/response";
import MainRepository from "../../repositories/MainRepository";
import { Status } from "../../types/user";
import { emailVerificationTemplate } from "../../lib/mails/emailVerificationTemplate";
import expressAsyncHandler from "express-async-handler";

export const resendEmailVerificationService = expressAsyncHandler(
  async function (req: Request, res: Response): Promise<void> {
    try {
      /** Validate the client request's body*/
      await validator(sendEmailVerificationSchema, req.body);

      const userFromDB = await MainRepository.findUserByEmail(req.body.email);

      // Check if the user exists
      if (!userFromDB) {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .json(ResponseTemplate.userNotFound());
        return;
      }

      // Check if the email already verified
      if (
        userFromDB.status === Status.ACTIVATED ||
        userFromDB.status === Status.DEACTIVATED
      ) {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .json(ResponseTemplate.successMessage("Email already verified"));
        return;
      }

      const token = (await generateJsonWebToken(
        req.body.email,
        "6h"
      )) as string;
      await emailVerificationTemplate(req.body.email, token);

      res
        .status(SUCCESS_RESPONSE_STATUS_CODE)
        .json(
          ResponseTemplate.successMessage(
            "Email has been sent successfully, Please verify your email"
          )
        );
    } catch (e) {
      res.status(BAD_REQUEST_STATUS_CODE);
      throw new Error(e);
    }
  }
);
