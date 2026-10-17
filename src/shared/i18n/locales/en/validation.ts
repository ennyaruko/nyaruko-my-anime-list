import type ru from "../ru/validation";

const validation = {
  loginRequired: "Username is required",
  passwordRequired: "Password is required",
  loginLatinOnly: "Username must not contain Cyrillic characters",
} satisfies typeof ru;

export default validation;
