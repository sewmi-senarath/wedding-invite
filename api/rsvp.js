import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, attending, guests, message } = req.body;

  if (!name || !attending) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "no-reply@weddingrsvp.com",
      to: process.env.EMAIL_USER,
      subject: `New RSVP: ${name}`,
      html: `
        <h2>New Wedding RSVP</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Attending:</strong> ${attending === "yes" ? "Yes ✅" : "No ❌"}</p>
        <p><strong>Guests:</strong> ${guests || "N/A"}</p>
        <p><strong>Message:</strong> ${message || "No message"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "RSVP received" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send RSVP" });
  }
}