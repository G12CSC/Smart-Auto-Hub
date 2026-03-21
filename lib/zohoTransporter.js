import nodemailer from "nodemailer";

const user = process.env.EMAIL_USER?.trim();
const pass = process.env.EMAIL_PASS?.trim();

export const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
        user,
        pass,
    },
    debug: true,
    logger: true,
});

// Optional: verify once when server starts
transporter.verify()
    .then(() => console.log("✅ SMTP READY"))
    .catch((err) => console.error("❌ SMTP ERROR:", err));