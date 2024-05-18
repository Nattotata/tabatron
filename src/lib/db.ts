import { sql, type QueryResultRow } from "@vercel/postgres";
import "dotenv/config";
import bcrypt from "bcrypt";
import validator from "validator";

type Status = "success" | "error" | "warning";

type ResponseObject = {
  message: string;
  status: Status;
  data?: {
    name?: string;
    password?: string;
    email?: string;
    salt?: string;
    role?: string;
  };
};

type UserInput = {
  name?: string;
  email?: string;
  password?: string;
  newPassword?: string;
  oldPassword?: string;
  salt?: string;
  hashedPw?: string;
};

const checkUserInput = ({
  name,
  email,
  password,
  salt,
  hashedPw,
}: UserInput): ResponseObject => {
  if (!name || !email || !password) {
    return {
      status: "error",
      message: "Username, email, password should be non-empty.",
    };
  }
  if (!validator.isAlpha(name)) {
    return {
      status: "error",
      message: "Username should be alphanumerical only.",
    };
  }
  if (!validator.isEmail(email)) {
    return {
      status: "error",
      message: "I don't think that's a legit email.",
    };
  }
  return {
    status: "success",
    message: "Name and email checked successfully!",
  };
};

const hashPassword = async (password: string) => {
  if (!password) {
    new Error("Password should not be empty.");
  }
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  return { hash, salt };
};

/**
 * Hashes a given password.
 * Inserts user, email, hashedPw, and salt
 * into users table in a database.
 */
export const createUser = async ({
  name = "",
  email = "",
  password = "",
}: UserInput): Promise<ResponseObject> => {
  const check = checkUserInput({ name, email, password });
  if (check.status === "error") {
    return {
      status: "error",
      message: check.message,
    };
  }
  const { hash, salt } = await hashPassword(password);
  try {
    await sql`
    INSERT INTO users (name, email, password, salt)
    VALUES (${name}, ${email}, ${hash}, ${salt});`;
    return {
      status: "success",
      message: "User created successfully.",
    };
  } catch (e) {
    return {
      status: "error",
      message: "Error writing to a database. Sucks.",
    };
  }
};

export const removeUser = async ({
  name,
  email,
}: {
  name: string;
  email: string;
}): Promise<ResponseObject> => {
  if (!validator.isEmail(email) || !validator.isAlpha(name)) {
    return {
      status: "error",
      message: "Something is wrong with the name or email.",
    };
  }
  try {
    await sql`
    DELETE FROM users WHERE email = ${email} AND name = ${name};
    `;
    return {
      status: "success",
      message: `User ${name} is removed.`,
    };
  } catch (e) {
    return {
      status: "error",
      message: `Couldn't remove user ${name} with email ${email} from database`,
    };
  }
};

const getPasswordAndSalt = async (email: string): Promise<ResponseObject> => {
  try {
    const { rows } = await sql`
    SELECT salt, password
    FROM users
    WHERE email = ${email}
    ;`;
    const salt = rows[0].salt.toString();
    const password = rows[0].password.toString();
    if (!salt || !password) {
      return {
        status: "error",
        message: "salt or password is falsy",
      };
    }
    return {
      status: "success",
      message: "",
      data: { salt, password },
    };
  } catch (e) {
    return {
      status: "error",
      message: "Couldn't find email in database.",
    };
  }
};

export const changePassword = async ({
  email,
  oldPassword,
  newPassword,
}: {
  email: string;
  oldPassword: string;
  newPassword: string;
}): Promise<ResponseObject> => {
  const dataFromDb = await getPasswordAndSalt(email);

  if (dataFromDb.status === "error")
    return {
      status: "error",
      message: dataFromDb.message,
    };

  const oldSalt = dataFromDb.data?.salt || "";
  const hashedPwFromDb = dataFromDb.data?.password || "";
  const oldHashedPw = await bcrypt.hash(oldPassword, oldSalt);
  if (hashedPwFromDb !== oldHashedPw) {
    return {
      status: "error",
      message: "Old password does not match the password in database.",
    };
  }
  const salt = await bcrypt.genSalt();
  const newHashedPw = await bcrypt.hash(newPassword, salt);
  try {
    await sql`
    UPDATE users
    SET password = ${newHashedPw},
    salt = ${salt}
    WHERE email = ${email}
    ;`;
    return {
      status: "success",
      message: "Password changed successfully!",
    };
  } catch (e) {
    return { status: "error", message: String(e) };
  }
};

const getUserByEmail = async (email: string): Promise<ResponseObject> => {
  if (!validator.isEmail(email)) {
    return {
      status: "error",
      message: "The input is not an email.",
    };
  }
  try {
    const dbData = await sql`SELECT * from users where email = ${email};`;
    return {
      status: "success",
      message: "",
      data: dbData.rows[0],
    };
  } catch (e) {
    return {
      status: "error",
      message: "Account doesn't exist yet.",
    };
  }
};

export const checkLogin = async ({
  inputEmail,
  inputPassword,
}: {
  inputEmail: string;
  inputPassword: string;
}): Promise<ResponseObject> => {
  const dbData = await getUserByEmail(inputEmail);
  if (dbData.status === "error") {
    return {
      status: "error",
      message: dbData.message,
    };
  }
  const { name, email, password, salt } = dbData.data;
  const hashedPw = await bcrypt.hash(inputPassword, salt);
  if (password === hashedPw) {
    return {
      status: "success",
      message: "Correct password.",
      data: { name, email },
    };
  }
  return {
    status: "error",
    message: "Incorrect password.",
  };
};
