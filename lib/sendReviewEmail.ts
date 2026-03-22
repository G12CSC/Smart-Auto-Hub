import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("ERROR: EMAIL_USER and EMAIL_PASS must be set in .env");
    process.exit(1);
}

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

export const sendReviewEmail = async (to: string, token: string) => {
  const reviewLink = `https://smartautohub.live/customer-reviews?token=${token}`;

  await transporter.sendMail({
    from: `"Sameera Auto Traders" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Review Your Consultation 🚗",
    html: `
      <h2>Thank you for choosing Sameera Auto Traders!</h2>
      <p>Your consultation has been completed.</p>
      <p>Please click the button below to leave a review:</p>
      
      <a href="${reviewLink}" 
         style="
           display:inline-block;
           padding:10px 20px;
           background:#2563eb;
           color:white;
           text-decoration:none;
           border-radius:5px;
         ">
         Leave a Review
      </a>

      <p>This link can only be used once.</p>
    `,
  });
};