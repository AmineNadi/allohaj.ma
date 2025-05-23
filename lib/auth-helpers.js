// lib/auth-helpers.js
import { getServerSession } from "next-auth";
import { authOptions } from "./auth"; // استيراد من lib/auth.js
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return session;
}
