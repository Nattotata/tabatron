import type { Actions } from "./$types";

import { createUser, checkLogin } from "$lib/db";

export const actions = {
  register: async ({ request }) => {
    const data = await request.formData();
    const email = data.get("email") || "";
    const name = data.get("name") || "";
    const password = data.get("password" || "");
    createUser({ name, email, password });
    console.info(email, name, password);
  },
  login: async ({ request }) => {
    const data = await request.formData();
    const email = data.get("email") || "";
    const password = data.get("password" || "");
    checkLogin({ email, password });
    console.info(email, password);
  },
} satisfies Actions;
