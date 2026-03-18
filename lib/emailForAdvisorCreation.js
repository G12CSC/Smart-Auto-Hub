import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const user = process.env.EMAIL_USER.trim();
const pass = process.env.EMAIL_PASS.trim();

console.log("USER:", user);
console.log("PASS LENGTH:", pass.length);
console.log("PASS VALUE:", JSON.stringify(pass));

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com", // try this instead
    port: 465,
    secure: true,
    auth: {
        user,
        pass,
    },
    debug: true,
    logger: true,
});

transporter.verify()
    .then(() => console.log("SMTP READY"))
    .catch(err => console.error("ERROR:", err));

export async function sendAdvisorTempID(email, tempPassword) {
    await transporter.sendMail({
        from: `"Smart Auto Hub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Advisor Account",
        html: `
      <h2>Welcome to Smart Auto Hub</h2>
      <p>Your temporary password:</p>
      <b>${tempPassword}</b>
      <p>Please login and change your password.</p>
    `,
    });

    await transporter.verify()
        .then(() => console.log("SMTP READY"))
        .catch(err => console.error("SMTP ERROR:", err));
}



