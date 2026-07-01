import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";
import { resend } from "@/lib/email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),

  emailAndPassword: {
    enabled: true,

    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "Semester Companion <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset your Semester Companion password",
        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
          <h2>Reset your password</h2>

          <p>Hello ${user.name},</p>

          <p>You requested to reset your password.</p>

          <p>
            <a
              href="${url}"
              style="
                display:inline-block;
                padding:12px 20px;
                background:#4f46e5;
                color:white;
                text-decoration:none;
                border-radius:8px;
              "
            >
              Reset Password
            </a>
          </p>

          <p>If you didn't request this, you can safely ignore this email.</p>

          <p>This link will expire automatically.</p>
        </div>
      `,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
