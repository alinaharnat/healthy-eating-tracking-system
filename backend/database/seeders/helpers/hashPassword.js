import bcrypt from "bcryptjs";

const DEFAULT_SALT_ROUNDS = 10;

export async function hashPassword(
  plainPassword,
  saltRounds = DEFAULT_SALT_ROUNDS,
) {
  if (!plainPassword || typeof plainPassword !== "string") {
    throw new Error("Password must be a non-empty string");
  }

  return bcrypt.hash(plainPassword, saltRounds);
}
