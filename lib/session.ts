import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "inswe-fallback-secret-change-in-production"
);

export type SessionPayload = {
  email: string;
  verified: boolean;
};

/**
 * Read and verify the session cookie from a Server Component or Route Handler.
 * Returns the payload if valid, null otherwise.
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("inswe_session")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
