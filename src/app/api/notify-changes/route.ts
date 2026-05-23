import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { submissionId, notes, editToken } = body;

    if (!submissionId || !editToken) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch submission with client info
    const { data: submission, error: fetchError } = await supabaseAdmin
      .from("submissions")
      .select("*, client:clients(*)")
      .eq("id", submissionId)
      .single();

    if (fetchError || !submission) {
      return Response.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const clientEmail = submission.client?.contact_email;
    const clientName = submission.client?.name || "";

    if (!clientEmail) {
      return Response.json(
        { error: "Client has no email address" },
        { status: 400 }
      );
    }

    // Save the edit token to the submission
    await supabaseAdmin
      .from("submissions")
      .update({ edit_token: editToken, status: "needs_changes", admin_notes: notes })
      .eq("id", submissionId);

    // Build the edit link
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";
    const editUrl = `${origin}/submit/edit/${editToken}`;

    // Check if Resend is configured
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      // No email service configured - just save the status and return the edit link
      return Response.json({
        success: true,
        emailSent: false,
        editUrl,
        message: "Status saved. Email not sent - RESEND_API_KEY not configured.",
      });
    }

    // Send email via Resend
    const resend = new Resend(resendKey);
    const fromEmail = process.env.EMAIL_FROM || "Insight Marketing <noreply@insightmarketing.co.il>";

    await resend.emails.send({
      from: fromEmail,
      to: clientEmail,
      subject: `Changes requested for your ad submission - Insight Marketing`,
      html: buildEmailHtml(clientName, notes, editUrl),
    });

    return Response.json({
      success: true,
      emailSent: true,
      editUrl,
    });
  } catch (err) {
    console.error("notify-changes error:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function buildEmailHtml(clientName: string, notes: string, editUrl: string): string {
  const greeting = clientName ? `Hi ${clientName},` : "Hi,";
  const escapedNotes = (notes || "").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");

  return `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8f9fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:#4f46e5;padding:28px 32px;text-align:center;">
              <img src="https://zynqxlcpxowvjugxalhv.supabase.co/storage/v1/object/public/assets/insight-logo-white.png" alt="Insight Marketing" height="32" style="height:32px;" onerror="this.style.display='none'">
              <div style="color:#ffffff;font-size:18px;font-weight:700;margin-top:8px;">Insight Marketing Solutions</div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;color:#1a1a2e;font-size:16px;line-height:1.5;">${greeting}</p>
              <p style="margin:0 0 20px;color:#444;font-size:15px;line-height:1.6;">We've reviewed your ad submission and have some changes we'd like you to make:</p>

              <!-- Notes box -->
              <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
                <div style="font-size:12px;font-weight:600;color:#92400e;text-transform:uppercase;margin-bottom:8px;">Requested Changes</div>
                <div style="color:#78350f;font-size:14px;line-height:1.6;">${escapedNotes}</div>
              </div>

              <p style="margin:0 0 24px;color:#444;font-size:15px;line-height:1.6;">Click the button below to open your submission and make the requested changes:</p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${editUrl}" style="display:inline-block;background:#4f46e5;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">
                      Edit My Submission
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;color:#888;font-size:13px;line-height:1.5;">If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${editUrl}" style="color:#4f46e5;word-break:break-all;">${editUrl}</a></p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8f9fa;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">Insight Marketing Solutions</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
