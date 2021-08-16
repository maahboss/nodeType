import { mailer } from "./mail";

export async function emailVerificationTemplate(email: string, token: string) {
  try {
    return await mailer(
      email,
      "Confirm your email",
      `<h1>Please Click the link below to confirm your email</h1>
    <a href="http://verify-email/${token}" target="_blank">Click here</a>
`
    );
  } catch (e) {
    console.log("Email doesn't work");
  }
}
