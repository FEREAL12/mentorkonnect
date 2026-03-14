import { NextResponse } from "next/server";
import { Resend } from "resend";
import { signToken } from "@/lib/otp";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(email: string, otp: string) {
  return resend.emails.send({
    from: FROM,
    to: [email],
    subject: "Your MentorKonnect verification code",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#1d4ed8;padding:28px 40px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">
                <span style="color:#93c5fd;">Mentor</span>Konnect
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;">Verify your email</h2>
              <p style="margin:0 0 32px;font-size:15px;color:#6b7280;">
                Use the code below to complete your sign-up. It expires in <strong>10 minutes</strong>.
              </p>
              <div style="background:#f0f5ff;border:2px solid #bfdbfe;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;">
                <p style="margin:0;font-size:40px;font-weight:800;letter-spacing:12px;color:#1d4ed8;">${otp}</p>
              </div>
              <p style="margin:0;font-size:13px;color:#9ca3af;">
                If you didn&rsquo;t request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; ${new Date().getFullYear()} MentorKonnect. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim(),
  });
}

// POST /api/auth/send-otp
export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, role, mentorData } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const otp = generateOtp();
  const exp = Date.now() + 10 * 60 * 1000; // 10 minutes

  const pendingToken = signToken({ email, password, role, mentorData: mentorData ?? null, otp, exp });

  const { error } = await sendOtpEmail(email, otp);
  if (error) {
    console.error("[send-otp] Resend error:", error);
    return NextResponse.json({ error: "Failed to send verification email. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ pendingToken });
}
