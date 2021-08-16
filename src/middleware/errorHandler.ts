import {
  INTERNAL_SERVER_STATUS_CODE,
  SUCCESS_RESPONSE_STATUS_CODE,
} from "../constants/constants";

import { NextFunction, Response } from "express";
import { IRequest } from "../lib/Request";
import * as constants from "../constants/constants";
import ResponseTemplate from "../lib/response";

const middlewares = {
  errorHandler(err: Error, req: IRequest, res: Response, next: NextFunction) {
    const statusCode =
      res.statusCode === SUCCESS_RESPONSE_STATUS_CODE
        ? INTERNAL_SERVER_STATUS_CODE
        : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.ENV === "production" ? null : err.stack,
    });
  },
  notFoundHandler(req: IRequest, res: Response) {
    res.statusCode = constants.NOT_FOUND_STATUS_CODE;
    res.json(ResponseTemplate.routeNotFound(req));
  },
};

export { middlewares };
