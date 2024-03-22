import type { Actions } from "./$types";

import { createUser, checkLogin } from "$lib/db";
import { verifyToken, signToken } from "$lib/jwt";

export const load = async ({ cookies }) => {
  try {
    const jwt = cookies.get("JWT");
    const parsedJwt = await verifyToken(jwt);
    console.info(parsedJwt);
    return { name: parsedJwt.name, email: parsedJwt.email };
  } catch {
    console.info("User not logged in");
  }
  return { name: "anon" };
};

export const actions = {
  register: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get("email") || "";
    const name = data.get("name") || "";
    const password = data.get("password" || "");
    await createUser({ name, email, password });
    const token = signToken({ name, email });
    const parsedToken = await verifyToken(token);
    cookies.set("JWT", token, { path: "/" });
    return {
      token,
      parsedToken,
      message: "User registered successfully!",
      status: 201, // Created
    };
  },
  login: async ({ request }) => {
    const data = await request.formData();
    const email = data.get("email") || "";
    const password = data.get("password" || "");
    checkLogin({ email, password });
    console.info(email, password);
  },
} satisfies Actions;
