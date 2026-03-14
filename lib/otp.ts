import crypto from "crypto";

const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyAndDecodeToken(token: string): Record<string, unknown> | null {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;
  const data = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  if (expected !== sig) return null;
  try {
    return JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
  } catch {
    return null;
  }
}
