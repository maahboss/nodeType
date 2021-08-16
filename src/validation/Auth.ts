import * as yup from "yup";
import { Login, Register, SendEmailVerification } from "../types/user";

const loginSchema: yup.SchemaOf<Login> = yup.object({
  email: yup.string().email("Email is not valid").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      `Password should be 8 digits length at least, contains at least one Capital letter, contains at least one number.)`
    ),
});

const sendEmailVerificationSchema: yup.SchemaOf<SendEmailVerification> =
  yup.object({
    email: yup
      .string()
      .email("Email is not valid")
      .required("Email is required"),
  });

const registerSchema: yup.SchemaOf<Register> = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  role: yup.string().required("Role is required"),
  email: yup.string().email("Email is not valid").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      `Password should be 8 digits length at least, contains at least one Capital letter, contains at least one number.)`
    ),
  passwordConfirmation: yup
    .string()
    .required("Password confirmation is required")
    .oneOf([yup.ref("password"), null], "Passwords should matches"),
  agreeOnTerms: yup.bool().required().oneOf([true], "Field must be checked"),
});

export { registerSchema, loginSchema, sendEmailVerificationSchema };
