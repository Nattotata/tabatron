import type { Actions } from "./$types";

import {
  createUser,
  checkLogin,
  removeUser,
} from "$lib/db";
import { verifyToken, signToken } from "$lib/jwt";

export const actions = {
  logOut: async ({ cookies }) => {
    // remove JWT token from cookies
    // and reset store
    cookies.delete("JWT", { path: "/" });
    return;
  },
  removeAccount: async ({ cookies }) => {
    const loggedUserCookie = cookies.get("JWT");
    const token = verifyToken(loggedUserCookie);

    cookies.delete("JWT", { path: "/" });
    removeUser({ name: token.name, email: token.email });
  },
  changePassword: async () => {},
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
      message: "User registered successfully!",
      status: 201,
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
      return;
    }
    if (status === 404) {
      console.error("User not found!");
      return;
    }
    if (status === 200) {
      console.info("Login successful!");
      const token = signToken({ name, email });
      cookies.set("JWT", token, { path: "/" });
    }
  },
} satisfies Actions;
