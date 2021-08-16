class APIError extends Error {
  public ErrorID: number | undefined;
  public code: null | number | undefined;
  constructor(message: string, ErrorID: number, code = null) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = "api error";
    this.message = message;
    if (ErrorID) this.ErrorID = ErrorID;
    if (code) this.code = code;
  }
}
export default APIError;
