import { NextResponse } from "next/server";
import { Resend } from "resend";
import { signToken, verifyAndDecodeToken } from "@/lib/otp";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

// POST /api/auth/send-otp/resend
export async function POST(request: Request) {
  const { pendingToken } = await request.json();

  const payload = verifyAndDecodeToken(pendingToken);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token. Please sign up again." }, { status: 400 });
  }

  const { email } = payload as { email: string };

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const newExp = Date.now() + 10 * 60 * 1000;

  const newPendingToken = signToken({ ...payload, otp: newOtp, exp: newExp });

  const { error } = await resend.emails.send({
    from: FROM,
    to: [email],
    subject: "Your new MentorKonnect verification code",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr><td style="background:#1d4ed8;padding:28px 40px;"><p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;"><span style="color:#93c5fd;">Mentor</span>Konnect</p></td></tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;">Your new verification code</h2>
              <p style="margin:0 0 32px;font-size:15px;color:#6b7280;">This code expires in <strong>10 minutes</strong>.</p>
              <div style="background:#f0f5ff;border:2px solid #bfdbfe;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;">
                <p style="margin:0;font-size:40px;font-weight:800;letter-spacing:12px;color:#1d4ed8;">${newOtp}</p>
              </div>
            </td>
          </tr>
          <tr><td style="padding:20px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;"><p style="margin:0;font-size:12px;color:#9ca3af;">&copy; ${new Date().getFullYear()} MentorKonnect.</p></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim(),
  });

  if (error) {
    return NextResponse.json({ error: "Failed to resend code. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ pendingToken: newPendingToken });
}
