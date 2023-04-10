const nodemailer = require("nodemailer");
const pug = require("pug");
const path = require("path");
const { convert } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.email = user.email;
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  _initTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async _send(template, subject) {
    const html = pug.renderFile(
      path.join(__dirname, "..", "..", "views", "emails", `${template}.pug`),
      {
        email: this.email,
        url: this.url,
        subject,
      }
    );

    const emailConfig = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this._initTransport().sendMail(emailConfig);
  }

  async sendVerify() {
    await this._send(
      "verify",
      "Welcome to our service!! Please verify your Email"
    );
  }

  async sendPasswordReset() {
    await this._send("passreset", "Password reset instructions..");
  }
};
