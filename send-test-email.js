#!/usr/bin/env node

// ✅ Load environment variables from .env.production
require('dotenv').config({ path: '.env.production' });

const nodemailer = require('nodemailer');

async function main() {
  console.log("📋 Using these env values:");
  console.log("EMAIL_SERVER_HOST:", process.env.EMAIL_SERVER_HOST);
  console.log("EMAIL_SERVER_USER:", process.env.EMAIL_SERVER_USER);
  console.log("EMAIL_FROM:", process.env.EMAIL_FROM);

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT || 587),
    secure: false, // 587 = TLS
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: "emmylite41@gmail.com", // 👈 test email address
      subject: "✅ Test Email from Production",
      text: "This is a test email sent via Gmail SMTP in production mode.",
    });

    console.log("✅ Message sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
}

main();
