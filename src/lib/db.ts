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
    return "RIP";
  }
  return "good";
};

export const removeUser = async ({ name, email }) => {
  try {
    await sql`
    DELETE FROM users WHERE email = ${email} AND name = ${name};
    `;
  } catch (e) {
    console.error(
      `Couldn't remove user ${name} with email ${email} from database`,
      e
    );
    return { success: false };
  }
  return { success: true };
};

export const changePassword = async ({
  email,
  oldPassword,
  newPassword,
}) => {
  const getPasswordAndSalt = async ({ email }) => {
    try {
      const data = await sql`
      SELECT salt, password
      FROM users
      WHERE email = ${email}
      ;`;
      return data;
    } catch (e) {
      console.error(e);
    }
  };
  const dataFromDb = getPasswordAndSalt({ email });
  const oldHashedPw = bcrypt.hash(
    oldPassword,
    dataFromDb[0].salt
  );
  if (oldPassword === oldHashedPw) {
    return "This is not correct old pw";
  }
  const salt = bcrypt.salt();
  const newHashedPw = bcrypt.hash(newPassword, salt);
  try {
    await sql`
    UPDATE users
    SET password = ${newHashedPw},
    salt = ${salt}
    WHERE email = ${email}
    ;`;
  } catch (e) {
    console.error("error updating password", e);
  }
};

const getUserByEmail = async (email: string) => {
  try {
    const dbData =
      await sql`SELECT * from users where email = ${email};`;
    return dbData.rows[0];
  } catch (e) {
    console.error(`Couldn't find user: ${email}`, e);
    return;
  }
};

export const checkLogin = async ({
  inputEmail,
  inputPassword,
}: {
  inputEmail: string;
  inputPassword: string;
}) => {
  const dbData = await getUserByEmail(inputEmail);
  if (!dbData) {
    return { name: "", email: "", status: 404 };
  }
  const { name, email, password, salt } = dbData;
  const hashedPw = await bcrypt.hash(inputPassword, salt);
  if (password === hashedPw) {
    return { name, email, status: 200 };
  }
  return { name: "", email: "", status: 401 };
};
