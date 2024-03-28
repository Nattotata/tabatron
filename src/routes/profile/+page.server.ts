import type { Actions } from "./$types";

import {
  createUser,
  checkLogin,
  removeUser,
  changePassword,
} from "$lib/db";
import { verifyToken, signToken } from "$lib/jwt";

export const actions = {
  logOut: async ({ cookies }) => {
    // remove JWT token from cookies
    // and reset store
    cookies.delete("JWT", { path: "/" });
    return {
      status: "tada",
      message: `See you later!`,
    };
  },
  removeAccount: async ({ cookies }) => {
    const loggedUserCookie = cookies.get("JWT");
    const token = verifyToken(loggedUserCookie);

    cookies.delete("JWT", { path: "/" });
    removeUser({ name: token.name, email: token.email });
    return {
      message: `Account removed. Goodbye, ${token.name}!`,
    };
  },
  changePassword: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = String(data.get("email"));
    const oldPw = String(data.get("oldPassword"));
    const newPw = String(data.get("newPassword"));
    const output = await changePassword({
      email,
      oldPassword: oldPw,
      newPassword: newPw,
    });
    return {
      message: output.message,
      status: output.status,
    };
  },
  register: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = String(data.get("email")) || "";
    const name = String(data.get("name")) || "";
    const password = String(data.get("password")) || "";
    await createUser({ name, email, password });
    const token = signToken({ name, email });
    const parsedToken = await verifyToken(token);
    cookies.set("JWT", token, { path: "/" });
    return {
      token,
      parsedToken,
      message: `Welcome aboard, ${name}!`,
      status: "tada",
    };
  },
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const inputEmail = String(data.get("email")) || "";
    const password = String(data.get("password")) || "";
    const { name, email, status } = await checkLogin({
      inputEmail: inputEmail,
      inputPassword: password,
    });
    if (status === 401) {
      console.error(
        "Unauthorized access! Passwords do not match."
      );
      return {
        message:
          "Unauthorized access! Passwords do not match.",
        status: "not tada",
      };
    }
    if (status === 404) {
      console.error("User not found!");
      return {
        message: "User not found!",
        status: "not tada",
      };
    }
    if (status === 200) {
      console.info("Login successful!");
      const token = signToken({ name, email });
      cookies.set("JWT", token, { path: "/" });
      return {
        message: `Welcome back, ${name}.`,
        status: "tada",
      };
    }
  },
} satisfies Actions;
