import { verifyToken } from "$lib/jwt";
import { userInfo } from "$stores/user";

const readCookie = (cookieKey: string, cookies) => {
  try {
    return cookies.get(cookieKey);
  } catch (e) {
    console.error("Error reading cookie JWT.", e);
    return null;
  }
};

export const load = async ({ cookies }) => {
  const cookie = readCookie("JWT", cookies);
  if (cookie) {
    const token = await verifyToken(cookie);
    return { name: token.name, email: token.email };
  }
  console.info(
    "Couldn't get user name and email from cookie"
  );
  return { name: "Anon", email: "fake@email.com" };
};
