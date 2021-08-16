import { Request, Response } from "express";
import {
  BAD_REQUEST_STATUS_CODE,
  SUCCESS_RESPONSE_STATUS_CODE,
} from "../../constants/constants";
import ResponseTemplate from "../../lib/response";
import generateJsonWebToken from "../../lib/generateJsonWebToken";
import { validator } from "../../validation/validator";
import { registerSchema } from "../../validation/Auth";
import MainRepository from "../../repositories/MainRepository";
import { emailVerificationTemplate } from "../../lib/mails/emailVerificationTemplate";
import expressAsyncHandler from "express-async-handler";

export const registerService = expressAsyncHandler(async function (
  req: Request,
  res: Response
): Promise<void> {
  const user = req.body;
  try {
    /** Validate the client request's body*/
    await validator(registerSchema, user);

    /** Check uniqueness*/
    const userFromDB = await MainRepository.findUserByEmail(user.email);
    if (userFromDB) {
      res
        .status(BAD_REQUEST_STATUS_CODE)
        .json(ResponseTemplate.userAlreadyExist());
      return;
    }

    // Create new user
    const newUser = await MainRepository.createNewUser(user);

    // Send verification email
    const token = (await generateJsonWebToken(newUser.email, "6h")) as string;
    await emailVerificationTemplate(newUser.email, token);

    res
      .status(SUCCESS_RESPONSE_STATUS_CODE)
      .json(
        ResponseTemplate.successMessage(
          "Registered successfully, Please verify your email"
        )
      );
  } catch (e) {
    res.status(BAD_REQUEST_STATUS_CODE);
    throw new Error(e);
  }
});
