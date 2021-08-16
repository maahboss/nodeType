import { Response } from "express";
import {
  BAD_REQUEST_STATUS_CODE,
  SUCCESS_RESPONSE_STATUS_CODE,
} from "../../constants/constants";
import MainRepository from "../../repositories/MainRepository";
import ResponseTemplate from "../../lib/response";
import { Status } from "../../types/user";
import expressAsyncHandler from "express-async-handler";
import { IRequest } from "../../lib/Request";

export const verifyEmailService = expressAsyncHandler(async function (
  req: IRequest,
  res: Response
): Promise<void> {
  try {
    const userFromDB = await MainRepository.findUserByEmail(req.email);

    // Check if the user exists
    if (!userFromDB) {
      res.status(BAD_REQUEST_STATUS_CODE).json(ResponseTemplate.userNotFound());
      return;
    }

    // Check if the email verified
    if (
      userFromDB.status === Status.ACTIVATED ||
      userFromDB.status === Status.DEACTIVATED
    ) {
      res
        .status(BAD_REQUEST_STATUS_CODE)
        .json(ResponseTemplate.successMessage("Email already verified"));
      return;
    }

    await MainRepository.changeUserStatusById(userFromDB._id, Status.ACTIVATED);

    res
      .status(SUCCESS_RESPONSE_STATUS_CODE)
      .json(ResponseTemplate.successMessage("Email verified"));
  } catch (e) {
    res.status(BAD_REQUEST_STATUS_CODE);
    throw new Error(e);
  }
});
