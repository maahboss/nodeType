import * as yup from "yup";
import { AuthTypes } from "../types/user";

export async function validator(
  validationSchema: yup.SchemaOf<AuthTypes>,
  obj: AuthTypes
) {
  return await validationSchema.validate(obj);
}
