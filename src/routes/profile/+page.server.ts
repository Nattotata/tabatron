import { verifyToken } from "$lib/jwt";

export const load = async ({ cookies }) => {
  const cookie = cookies.get("JWT") || undefined;
  if (cookie === undefined) {
    return { name: "Brouček", email: "" };
  }
  const token = await verifyToken(cookies.get("JWT"));
  return { name: token.name, email: token.email };
};
