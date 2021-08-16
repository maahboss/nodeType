export interface Login {
  email: string;
  password: string;
}

export interface SendEmailVerification {
  email: string;
}

export interface Register {
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirmation: string;
  email: string;
  role: string;
  agreeOnTerms: boolean;
}

export enum Status {
  NOT_VERIFIED = "NOT_VERIFIED",
  DEACTIVATED = "DEACTIVATED",
  ACTIVATED = "ACTIVATED",
}

export type AuthTypes = Login | Register | SendEmailVerification;
