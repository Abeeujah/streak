import nodemailer from "nodemailer";

function mailCategory(subject: string) {
  subject = subject.toLowerCase();
  if (subject === "registration") {
    return {
      subject,
      message: "Registration successful.",
    };
  } else if (subject === "profile") {
    return {
      subject,
      message: "Profile created successfully",
    };
  } else {
    return {
      subject,
      message: "Thank you for being a part of us",
    };
  }
}

interface MailPart {
  email: string;
  subject: string;
}

async function sendMail(part: MailPart) {
  const mailer = process.env.GOOGLE_ACCOUNT;

  const mailConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: mailer,
      pass: process.env.GOOGLE_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(mailConfig);

  const { message, subject } = mailCategory(part.subject);
  const mailOptions = {
    from: mailer,
    to: part.email,
    subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }

    if (info) {
      console.log(info);
    }
  });
}

export default sendMail;
