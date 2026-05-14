import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendWelcomeEmail(
  email: string
) {
  try {
    await resend.emails.send({
      from: `DescGen India <${process.env.RESEND_FROM_EMAIL}>`,

      to: email,

      subject:
        "Your 10 free credits are ready - DescGen India",

      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;">
          
          <div style="margin-bottom:24px;">
            <span style="font-size:22px;font-weight:700;color:#111;">
              DescGen India
            </span>
          </div>

          <h1 style="font-size:28px;font-weight:700;color:#111;margin-bottom:12px;">
            Welcome! Your free credits are ready 🚀
          </h1>

          <p style="color:#555;line-height:1.8;margin-bottom:16px;">
            You can now generate AI-powered product descriptions
            for <strong>Meesho</strong>,
            <strong> Amazon</strong>,
            <strong> Flipkart</strong>,
            <strong> Myntra</strong>, and
            <strong> Instagram Shops</strong>.
          </p>

          <p style="color:#555;line-height:1.8;margin-bottom:24px;">
            Your account includes
            <strong> 10 free credits</strong>
            to start generating marketplace-ready listings instantly.
          </p>

          <a
            href="https://descgen.shop/dashboard/generate"
            style="
              display:inline-block;
              background:#111;
              color:#fff;
              padding:14px 28px;
              border-radius:12px;
              text-decoration:none;
              font-weight:600;
              font-size:15px;
            "
          >
            Generate your first description
          </a>

          <p style="color:#999;font-size:13px;margin-top:40px;line-height:1.7;">
            Questions or feedback? Just reply to this email.
            <br /><br />
            — Team DescGen India
          </p>

          <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;">
            <a
              href="https://descgen.shop/privacy"
              style="color:#999;font-size:11px;text-decoration:none;margin-right:12px;"
            >
              Privacy Policy
            </a>

            <a
              href="https://descgen.shop/terms"
              style="color:#999;font-size:11px;text-decoration:none;"
            >
              Terms of Service
            </a>
          </div>

        </div>
      `,
    });

  } catch (err) {
    console.error(
      "Welcome email failed:",
      err
    );
  }
}