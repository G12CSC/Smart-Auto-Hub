import { transporter } from "./zohoTransporter";

export async function sendAdvisorAssignmentEmail(email, booking, name) {

    await transporter.sendMail({
        from: `"Smart Auto Hub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Assign to Consultation Booking",
        html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    
    <div style="background: #0f172a; color: white; padding: 20px; text-align: center;">
      <h2 style="margin: 0;">Smart Auto Hub</h2>
      <p style="margin: 5px 0 0;">You have been assigned to a consultation booking.</p>
    </div>

    <div style="padding: 30px;">
      <p>Hello ${name},</p>
      <p>A new consultation booking has been assigned to you.</p>
      
        <p style="margin-top: 15px; text-align: center;">
        Please log in to your advisor dashboard to view the details of the consultation booking and prepare accordingly.
        </p>

        <div>
            <h2 style="text-align: center; margin-top: 30px;">Booking Details</h2>
            <p><strong>Customer Name:</strong> ${booking?.fullName || "N/A"}</p>
            <p><strong>Vehicle:</strong> ${booking?.vehicleType || "N/A"}</p>
            <p><strong>Preferred Date:</strong> ${booking?.preferredDate ? new Date(booking.preferredDate).toLocaleString() : "N/A"}</p>
            <p><strong>Preferred Time:</strong> ${booking?.preferredTime || "N/A"}</p>
            <p><strong>consultationType Type:</strong> ${booking?.consultationType || "N/A"}</p>
            <p><strong>Created At:</strong> ${booking?.createdAt ? new Date(booking.createdAt).toLocaleString() : "N/A"}</p>
            <p><strong>Additional Notes:</strong> ${booking?.additionalNotes || "N/A"}</p>

        </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://smartautohub.live/admin/login"
           style="background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px;">
           Login Now
        </a>
      </div>
    </div>

    <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px;">
      © ${new Date().getFullYear()} Smart Auto Hub
    </div>

  </div>
</div>
    `,
    });
}