import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { otpStore } from "@/lib/otpStore";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Rate-limit: block if a valid code was sent in the last 60 seconds
    const existing = otpStore.get(email);
    if (existing && existing.expiresAt - Date.now() > 9 * 60 * 1000) {
      return NextResponse.json(
        { error: "A code was already sent. Please wait 60 seconds before requesting another." },
        { status: 429 }
      );
    }

    const code = generateOtp();
    otpStore.set(email, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
    });

    // Use Resend — works on Vercel serverless without SMTP config
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      otpStore.delete(email);
      return NextResponse.json(
        { error: "Email service is not configured. Please contact support." },
        { status: 503 }
      );
    }

    const resend = new Resend(resendKey);

    const { error } = await resend.emails.send({
      from: "Inswè <onboarding@resend.dev>",
      to: email,
      subject: `${code} is your Inswè verification code`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#ffffff;">
          <h2 style="font-size:20px;font-weight:700;color:#1a1a1a;margin:0 0 8px;">Inswè</h2>
          <p style="font-size:15px;color:#555;margin:0 0 32px;">Use the code below to sign in or create your account.</p>
          <div style="background:#f5f5f5;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
            <span style="font-size:44px;font-weight:700;letter-spacing:14px;color:#1a1a1a;">${code}</span>
          </div>
          <p style="font-size:13px;color:#888;margin:0;">
            This code expires in <strong>10 minutes</strong>.<br/>
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
      text: `Your Inswè verification code is: ${code}\n\nThis code expires in 10 minutes.`,
    });

    if (error) {
      otpStore.delete(email);
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("send-otp error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
