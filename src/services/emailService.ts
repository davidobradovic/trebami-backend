import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  /**
   * Initialize email transporter
   */
  private static async getTransporter(): Promise<nodemailer.Transporter> {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
    return this.transporter!;
  }

  /**
   * Send email
   */
  static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const transporter = await this.getTransporter();
      
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        text: options.text || this.htmlToText(options.html),
        html: options.html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Send order confirmation email
   */
  static async sendOrderConfirmation(
    customerEmail: string,
    orderNumber: string,
    orderDetails: any
  ): Promise<boolean> {
    const subject = `Order Confirmation - ${orderNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Thank you for your order!</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Service:</strong> ${orderDetails.title}</p>
          <p><strong>Date:</strong> ${new Date(orderDetails.scheduledDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${orderDetails.scheduledTime}</p>
          <p><strong>Total:</strong> $${orderDetails.totalPrice}</p>
        </div>
        <p>We'll keep you updated on the status of your order.</p>
        <p>Best regards,<br>Your Service Team</p>
      </div>
    `;

    return this.sendEmail({ to: customerEmail, subject, html });
  }

  /**
   * Send order status update email
   */
  static async sendOrderStatusUpdate(
    customerEmail: string,
    orderNumber: string,
    status: string,
    additionalInfo?: string
  ): Promise<boolean> {
    const subject = `Order Status Update - ${orderNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Status Update</h2>
        <p>Your order status has been updated.</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Order Information</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>New Status:</strong> <span style="color: #007bff; font-weight: bold;">${status}</span></p>
          ${additionalInfo ? `<p><strong>Additional Information:</strong> ${additionalInfo}</p>` : ''}
        </div>
        <p>Thank you for choosing our services!</p>
        <p>Best regards,<br>Your Service Team</p>
      </div>
    `;

    return this.sendEmail({ to: customerEmail, subject, html });
  }

  /**
   * Send worker assignment email
   */
  static async sendWorkerAssignment(
    workerEmail: string,
    orderNumber: string,
    orderDetails: any
  ): Promise<boolean> {
    const subject = `New Order Assignment - ${orderNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Order Assignment</h2>
        <p>You have been assigned a new order!</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Service:</strong> ${orderDetails.title}</p>
          <p><strong>Description:</strong> ${orderDetails.description}</p>
          <p><strong>Date:</strong> ${new Date(orderDetails.scheduledDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${orderDetails.scheduledTime}</p>
          <p><strong>Location:</strong> ${orderDetails.location.address}, ${orderDetails.location.city}</p>
          <p><strong>Customer Notes:</strong> ${orderDetails.customerNotes || 'None'}</p>
        </div>
        <p>Please review the order details and update the status accordingly.</p>
        <p>Best regards,<br>Service Management Team</p>
      </div>
    `;

    return this.sendEmail({ to: workerEmail, subject, html });
  }

  /**
   * Send password reset email
   */
  static async sendPasswordReset(
    userEmail: string,
    resetToken: string,
    resetUrl: string
  ): Promise<boolean> {
    const subject = 'Password Reset Request';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You have requested to reset your password.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}?token=${resetToken}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}?token=${resetToken}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>Your Service Team</p>
      </div>
    `;

    return this.sendEmail({ to: userEmail, subject, html });
  }

  /**
   * Convert HTML to plain text
   */
  private static htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .trim();
  }

  /**
   * Test email configuration
   */
  static async testConnection(): Promise<boolean> {
    try {
      const transporter = await this.getTransporter();
      await transporter.verify();
      console.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}
