import { Request, Response } from "express";
import {
  BAD_REQUEST_STATUS_CODE,
  SUCCESS_RESPONSE_STATUS_CODE,
} from "../../constants/constants";
import ResponseTemplate from "../../lib/response";
import generateJsonWebToken from "../../lib/generateJsonWebToken";
import { validator } from "../../validation/validator";
import { loginSchema } from "../../validation/Auth";
import MainRepository from "../../repositories/MainRepository";
import { Status } from "../../types/user";
import expressAsyncHandler from "express-async-handler";

export const loginService = expressAsyncHandler(async function (
  req: Request,
  res: Response
): Promise<void> {
  const user = req.body;

  try {
    /** Validate the client request's body*/
    await validator(loginSchema, user);

    const userFromDB = await MainRepository.findUserByEmail(user.email);

    // Check if the user exists
    if (!userFromDB) {
      res.status(BAD_REQUEST_STATUS_CODE).json(ResponseTemplate.userNotFound());
      return;
    }

    // Check if the email not verified
    if (userFromDB.status === Status.NOT_VERIFIED) {
      res
        .status(BAD_REQUEST_STATUS_CODE)
        .json(ResponseTemplate.userEmailNotVerified());
      return;
    }

    // Check if the email is DEACTIVATED
    if (userFromDB.status === Status.DEACTIVATED) {
      res
        .status(BAD_REQUEST_STATUS_CODE)
        .json(ResponseTemplate.userAccountDeactivated());
      return;
    }

    // Check if the password matches
    if (userFromDB && !(await userFromDB.matchPassword(user.password))) {
      res
        .status(BAD_REQUEST_STATUS_CODE)
        .json(
          ResponseTemplate.error(
            "Invalid Password",
            "Password doesn't match the email",
            BAD_REQUEST_STATUS_CODE
          )
        );
      return;
    }

    res.status(SUCCESS_RESPONSE_STATUS_CODE).json(
      ResponseTemplate.success(
        {
          user: {
            _id: userFromDB._id,
            firstName: userFromDB.firstName,
            middleName: userFromDB.middleName,
            lastName: userFromDB.lastName,
            email: userFromDB.email,
            role: userFromDB.role,
            status: userFromDB.status,
          },
          token: await generateJsonWebToken(userFromDB._id),
        },
        "Logged in successfully"
      )
    );
  } catch (e) {
    res.status(BAD_REQUEST_STATUS_CODE);
    throw new Error(e);
  }
});
