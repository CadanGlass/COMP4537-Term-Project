class EmailService {
  constructor(transporter, clientUrl) {
    this.transporter = transporter;
    this.clientUrl = clientUrl;
  }

  sendResetEmail = async (email, token) => {
    const resetLink = `${this.clientUrl}/reset-password?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`
    };

    return await this.transporter.sendMail(mailOptions);
  }
}

module.exports = EmailService; 