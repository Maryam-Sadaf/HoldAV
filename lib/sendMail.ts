import nodemailer from "nodemailer";
// import * as dotenv from "dotenv";
// dotenv.config();

export const sendInvitaionLinkMail = async (
  email: string,
  text: string,
  subject: string,
  htmlContent: string
) => {
  try {
    console.log("🚀 Starting email send process...");
    console.log("📧 Target email:", email);
    console.log("📧 Subject:", subject);
    console.log("📧 NODE_ENV:", process.env.NODE_ENV);
    
    // Debug environment variables
    console.log("🔍 Environment Variables Debug:");
    console.log("  EMAIL_SERVER_HOST:", process.env.EMAIL_SERVER_HOST || "NOT SET");
    console.log("  EMAIL_SERVER_PORT:", process.env.EMAIL_SERVER_PORT || "NOT SET");
    console.log("  EMAIL_SERVER_USER:", process.env.EMAIL_SERVER_USER || "NOT SET");
    console.log("  EMAIL_SERVER_PASSWORD:", process.env.EMAIL_SERVER_PASSWORD ? "***SET***" : "NOT SET");
    console.log("  EMAIL_FROM:", process.env.EMAIL_FROM || "NOT SET");
    console.log("  HOST:", process.env.HOST || "NOT SET");
    console.log("  USER:", process.env.USER || "NOT SET");
    console.log("  PASS:", process.env.PASS ? "***SET***" : "NOT SET");

    let transporter;

    // Development mode - use Ethereal for email preview
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 Development mode: Creating test email account...");
      
      // Create a test account with Ethereal
      const testAccount = await nodemailer.createTestAccount();
      console.log("🔧 Ethereal test account created:", testAccount.user);
      
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else {
      // Production mode - use actual SMTP
      const emailConfig = {
        host: process.env.EMAIL_SERVER_HOST || process.env.HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || process.env.EMAIL_PORT || 587),
        secure: Boolean(process.env.EMAIL_SERVER_SECURE || process.env.SECURE || false),
        auth: {
          user: process.env.EMAIL_SERVER_USER || process.env.USER,
          pass: process.env.EMAIL_SERVER_PASSWORD || process.env.PASS,
        },
      };

      console.log("📧 Production mode: Using SMTP configuration");
      console.log("📧 Full email config:", {
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: {
          user: emailConfig.auth.user,
          pass: emailConfig.auth.pass ? "***SET***" : "NOT SET"
        }
      });

      // Validate required email configuration
      if (!emailConfig.auth.user || !emailConfig.auth.pass) {
        const missingVars = [];
        if (!emailConfig.auth.user) missingVars.push("EMAIL_SERVER_USER");
        if (!emailConfig.auth.pass) missingVars.push("EMAIL_SERVER_PASSWORD");
        throw new Error(`Email configuration missing: ${missingVars.join(", ")} are required`);
      }

      if (!emailConfig.host) {
        throw new Error("Email configuration missing: EMAIL_SERVER_HOST is required");
      }

      transporter = nodemailer.createTransport(emailConfig);
    }

    // Verify transporter configuration
    console.log("🔍 Verifying SMTP connection...");
    try {
      await transporter.verify();
      console.log("✅ SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("❌ SMTP verification failed:");
      console.error("❌ Verify error details:", verifyError);
      throw new Error(`SMTP verification failed: ${verifyError instanceof Error ? verifyError.message : 'Unknown verification error'}`);
    }

    // Prepare email data
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER || process.env.USER;
    console.log("📧 From email:", fromEmail);
    console.log("📧 To email:", email);
    console.log("📧 Subject:", subject);
    console.log("📧 HTML content length:", htmlContent.length);

    // Send email
    console.log("📤 Attempting to send email...");
    const info = await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: subject,
      text: text,
      html: htmlContent,
    });

    console.log("📧 Email send result:", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      pending: info.pending,
      response: info.response
    });

    // Development mode - show preview URL
    if (process.env.NODE_ENV === "development") {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("📧 Development email sent! Preview URL:", previewUrl);
      console.log("📧 Email sent to:", email);
      console.log("📧 Subject:", subject);
    } else {
      console.log("📧 Production email sent successfully to:", email);
      console.log("📧 Message ID:", info.messageId);
      console.log("📧 Accepted recipients:", info.accepted);
      console.log("📧 Rejected recipients:", info.rejected);
    }

    return info;
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error("❌ Error type:", error?.constructor?.name);
    console.error("❌ Error message:", error instanceof Error ? error.message : 'Unknown error');
    console.error("❌ Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    console.error("❌ Full error object:", error);
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('authentication')) {
        console.error("🔐 AUTHENTICATION ERROR: Check your email credentials (EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD)");
      } else if (error.message.includes('connection')) {
        console.error("🌐 CONNECTION ERROR: Check your SMTP host and port settings");
      } else if (error.message.includes('timeout')) {
        console.error("⏰ TIMEOUT ERROR: SMTP server is not responding");
      } else if (error.message.includes('rejected')) {
        console.error("📧 REJECTION ERROR: Email was rejected by the server");
      }
    }
    
    // Re-throw the error so the API can handle it properly
    throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const sendCreationMail = async (
  email: string,
  text: string,
  subject: string,
  htmlContent: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
      html: htmlContent,
    });
  } catch (error) {
    console.log("epost ikke sendt!");
    console.log(error);
    return error;
  }
};

export const sendUpdateMail = async (
  email: string,
  text: string,
  subject: string,
  htmlContent: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
      html: htmlContent,
    });
  } catch (error) {
    console.log("epost ikke sendt!");
    console.log(error);
    return error;
  }
};
