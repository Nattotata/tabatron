import { sql } from "@vercel/postgres";
import "dotenv/config";
import bcrypt from "bcrypt";
import { signToken } from "$lib/jwt";

type CreateUserInput = {
  name: FormDataEntryValue;
  email: FormDataEntryValue;
  password: FormDataEntryValue;
};

export const createUser = async ({
  name,
  email,
  password,
}: CreateUserInput) => {
  const salt = await bcrypt.genSalt();
  const hashedPw = await bcrypt.hash(password, salt);
  try {
    await sql`
    INSERT INTO users (name, email, password, salt)
    VALUES (${name}, ${email}, ${hashedPw}, ${salt});`;
    console.info(
      "🎉🎉🎉",
      `name: ${name}
      email: ${email}
      password: ${hashedPw}
      salt: ${salt}`
    );
  } catch (e) {
    console.error("not tada", e);
  }
  return "good";
};

export const checkLogin = async ({ email, password }) => {
  const dbData = await sql`SELECT * from users where email = ${email};`;
  const pwFromDb = dbData.rows[0].password;
  const hashedPw = await bcrypt.hash(password, dbData.rows[0].salt);

  const token = signToken({ email });
  // https://www.npmjs.com/package/jsonwebtoken
  return token;
};
