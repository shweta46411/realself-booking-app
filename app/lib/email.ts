import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface BookingEmailData {
  name: string;
  email: string;
  serviceName: string;
  timeslot: string;
  duration: string;
}

export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean> {
  const { name, email, serviceName, timeslot, duration } = data;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - RealSelf</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; line-height: 1.6; color: #000000; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #000000; margin: 0;">REALSELF</h1>
        </div>
        
        <div style="background-color: #ffffff; border: 2px solid #FF6B35; border-radius: 16px; padding: 30px; margin-bottom: 20px;">
          <h2 style="font-size: 24px; font-weight: 900; color: #000000; margin-top: 0; text-transform: uppercase;">Booking Confirmed!</h2>
          
          <p style="font-size: 16px; color: #4B5563; margin-bottom: 20px;">
            Hi ${name},
          </p>
          
          <p style="font-size: 16px; color: #4B5563; margin-bottom: 30px;">
            Your appointment has been successfully booked! We're excited to help you on your aesthetic journey.
          </p>
          
          <div style="background-color: #FDF2EE; border: 2px solid #FF838A; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <p style="margin: 10px 0; font-size: 14px;">
              <strong style="color: #000000;">Service:</strong> 
              <span style="color: #4B5563;">${serviceName}</span>
            </p>
            <p style="margin: 10px 0; font-size: 14px;">
              <strong style="color: #000000;">Time:</strong> 
              <span style="color: #4B5563;">${timeslot}</span>
            </p>
            <p style="margin: 10px 0; font-size: 14px;">
              <strong style="color: #000000;">Duration:</strong> 
              <span style="color: #4B5563;">${duration}</span>
            </p>
          </div>
          
          <p style="font-size: 14px; color: #4B5563; margin-top: 30px;">
            If you need to make any changes, please contact us as soon as possible.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #D1D5DB;">
          <p style="font-size: 12px; color: #9CA3AF; margin: 0;">
            © ${new Date().getFullYear()} RealSelf. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  `;

  const emailText = `
REALSELF - Booking Confirmation

Hi ${name},

Your appointment has been successfully booked!

Service: ${serviceName}
Time: ${timeslot}
Duration: ${duration}

If you need to make any changes, please contact us as soon as possible.

© ${new Date().getFullYear()} RealSelf. All rights reserved.
  `;

  if (!resend) {
    console.log('📧 Email would be sent (Resend not configured):');
    console.log('To:', email);
    console.log('Subject: Booking Confirmation - RealSelf');
    console.log('---');
    console.log(emailText);
    return true;
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    // For Resend free tier: can only send to account email
    // In production, verify a domain to send to any email
    const accountEmail = process.env.RESEND_ACCOUNT_EMAIL || 'shweta.sharma0394@gmail.com';
    const recipientEmail = process.env.NODE_ENV === 'production' && !fromEmail.includes('resend.dev') 
      ? email 
      : accountEmail; // Use account email for testing with onboarding@resend.dev
    
    const result = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject: 'Booking Confirmation - RealSelf',
      html: emailHtml,
      text: emailText,
    });

    if (result.error) {
      console.error('Resend API error:', result.error);
      // If it's a validation error about recipient, log it but don't fail completely
      if (result.error.message?.includes('can only send testing emails')) {
        console.warn('⚠️ Resend free tier limitation: Can only send to account email. Booking still created.');
        console.warn('💡 To send to any email, verify a domain at resend.com/domains');
      }
      return false;
    }

    if (recipientEmail !== email) {
      console.log(`✅ Confirmation email sent to ${recipientEmail} (account email - Resend free tier limitation)`);
      console.log(`📝 Note: To send to ${email}, verify a domain in Resend dashboard`);
    } else {
      console.log(`✅ Confirmation email sent to ${email}`);
    }
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return false;
  }
}

