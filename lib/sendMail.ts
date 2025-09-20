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

    let transporter;

    // Development mode - use Ethereal for email preview
    if (process.env.NODE_ENV === "development") {
      // Create a test account with Ethereal (with timeout to avoid hanging)
      const testAccount = await Promise.race([
        nodemailer.createTestAccount(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Ethereal account creation timeout')), 10000)
        )
      ]) as any;
      
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
        connectionTimeout: 10000, // 10 second timeout
        greetingTimeout: 5000, // 5 second greeting timeout
        socketTimeout: 10000, // 10 second socket timeout
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
    try {
      await transporter.verify();
    } catch (verifyError) {
      throw new Error(`SMTP verification failed: ${verifyError instanceof Error ? verifyError.message : 'Unknown verification error'}`);
    }

    // Prepare email data
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER || process.env.USER;
    const info = await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: subject,
      text: text,
      html: htmlContent,
    });

    // Development mode - show preview URL
    if (process.env.NODE_ENV === "development") {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("Development email sent! Preview URL:", previewUrl);
    }

    return info;
  } catch (error) {
    console.error("Email sending failed:", error instanceof Error ? error.message : 'Unknown error');
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
