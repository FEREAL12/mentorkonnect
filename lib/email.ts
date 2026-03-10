import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Use the exact from address — must match a verified domain in Resend
const FROM_ADDRESS = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function sendBookingNotificationToMentor({
  mentorEmail,
  mentorName,
  menteeName,
  scheduledAt,
  durationMins,
  notes,
}: {
  mentorEmail: string;
  mentorName: string;
  menteeName: string;
  scheduledAt: Date;
  durationMins: number;
  notes?: string | null;
}) {
  const dateStr = scheduledAt.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = scheduledAt.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const { data, error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: [mentorEmail],
    subject: `New session booking from ${menteeName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1d4ed8;padding:28px 40px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">
                <span style="color:#93c5fd;">Mentor</span>Konnect
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;">
                You have a new session booking!
              </h2>
              <p style="margin:0 0 28px;font-size:15px;color:#6b7280;">
                Hi ${mentorName}, <strong>${menteeName}</strong> has booked a session with you.
              </p>

              <!-- Details card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;width:110px;">Mentee</td>
                        <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:600;">${menteeName}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Date</td>
                        <td style="padding:6px 0;font-size:14px;color:#111827;">${dateStr}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Time</td>
                        <td style="padding:6px 0;font-size:14px;color:#111827;">${timeStr}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Duration</td>
                        <td style="padding:6px 0;font-size:14px;color:#111827;">${durationMins} minutes</td>
                      </tr>
                      ${
                        notes
                          ? `<tr>
                        <td style="padding:6px 0;font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;vertical-align:top;">Notes</td>
                        <td style="padding:6px 0;font-size:14px;color:#374151;">${notes}</td>
                      </tr>`
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:14px;color:#6b7280;">
                Please review and confirm the session from your dashboard.
              </p>

              <!-- CTA -->
              <a href="${APP_URL}/sessions"
                style="display:inline-block;background:#1d4ed8;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:8px;">
                View Session &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                You&rsquo;re receiving this because you&rsquo;re a mentor on MentorKonnect.
                &copy; ${new Date().getFullYear()} MentorKonnect.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });

  if (error) {
    console.error("[email] Resend error:", JSON.stringify(error));
    throw new Error(error.message);
  }

  console.log("[email] Booking notification sent, id:", data?.id);
}
