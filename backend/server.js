import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/rsvp", async (req, res) => {
  const { name, email, attending, guests, dietary, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Wedding RSVP 💌",
      html: `
        <h2>New RSVP Received</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Attending:</b> ${attending}</p>
        <p><b>Guests:</b> ${guests}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Email failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});