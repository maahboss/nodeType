import { IRequest } from "../Request";
import {
  BAD_REQUEST_STATUS_CODE,
  NOT_AUTHORIZED_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
} from "../../constants/constants";
import { Status } from "../../types/user";

interface IData {
  [key: string]: any;
}

interface IError {
  message: string;
  code: number;
  error: string;
}

const ResponseTemplate = {
  general(data: IData) {
    return data;
  },
  successMessage(message: string) {
    return {
      success: true,
      message,
    };
  },
  /**
   * Returns standard success response
   * @param {*} data
   * @param {String} message
   */
  success(data: IData, message: string) {
    return {
      success: true,
      message,
      data,
    };
  },
  error(message: string, err: string, code: number) {
    return {
      success: false,
      message: message || "some error occurred",
      error:
        err || "error occurred on server, please try again after some time.",
      code: code,
    };
  },
  commonAuthUserDataError(data: IError) {
    return ResponseTemplate.error(
      data.message || "Authentication error",
      data.error || "token verification failed, Please try again",
      data.code
    );
  },
  emptyContent() {
    return ResponseTemplate.error(
      "empty content found",
      `you must provide valid data and it must not be empty
      ref: http://stackoverflow.com/questions/18419428/what-is-the-minimum-valid-json`,
      BAD_REQUEST_STATUS_CODE
    );
  },
  invalidContentType() {
    return ResponseTemplate.error(
      "invalid content type",
      `you must specify content type and it must be application/json',
      ref: 'http://stackoverflow.com/questions/477816/what-is-the-correct-json-content-type`,
      BAD_REQUEST_STATUS_CODE
    );
  },
  routeNotFound(req: IRequest) {
    return ResponseTemplate.error(
      "api not found",
      `${req.method} ${req.url}`,
      NOT_FOUND_STATUS_CODE
    );
  },
  userNotFound() {
    return ResponseTemplate.error(
      "user not found",
      "the user you're looking for doesn't exist or you dont have permissions to access it.",
      NOT_FOUND_STATUS_CODE
    );
  },
  userAlreadyExist() {
    return ResponseTemplate.error(
      "user with email already exist",
      "User with same email already exist in System, please use another email",
      BAD_REQUEST_STATUS_CODE
    );
  },
  userAlreadyInvited() {
    return ResponseTemplate.error(
      "user with email already invited",
      "User with same email already invited, Another link can be send after 24 hours window",
      BAD_REQUEST_STATUS_CODE
    );
  },
  userNotAuthorized() {
    return ResponseTemplate.error(
      "Not authorized, token failed",
      "Authorization failed, token is not sent or expired",
      NOT_AUTHORIZED_STATUS_CODE
    );
  },
  userEmailNotVerified() {
    return {
      ...ResponseTemplate.error(
        "Not Verified, Verify your email",
        "Email is not verified, to continue this process verify your email",
        NOT_AUTHORIZED_STATUS_CODE
      ),
      status: Status.NOT_VERIFIED,
    };
  },
  userAccountDeactivated() {
    return {
      ...ResponseTemplate.error(
        "Your account has been deactivated, please contact the support to reactivate",
        "The account has been deactivated from an admin",
        NOT_AUTHORIZED_STATUS_CODE
      ),
      status: Status.DEACTIVATED,
    };
  },
};

export default ResponseTemplate;
