import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.trim() === '') {
      console.error('RESEND_API_KEY is not set or is empty.');
      return NextResponse.json({ error: 'Server configuration error: RESEND_API_KEY is missing or empty.' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY); // Moved inside the function

    console.log('Received request to /api/contact');
    const { name, whatsapp } = await request.json();
    console.log('Parsed request body:', { name, whatsapp });

    if (!name || !whatsapp) {
      console.error('Validation error: Name or WhatsApp is missing.');
      return NextResponse.json({ error: 'Name and WhatsApp are required.' }, { status: 400 });
    }

    let emailData;
    try {
      console.log('Attempting to send email with Resend...');
      emailData = await resend.emails.send({
        from: 'contato@bon.com.br', // Updated to the correct sending email
        to: 'bonitoon945@gmail.com', // Updated to the correct recipient email
        subject: 'Novo Lead',
        html: `
          <p>Name: ${name}</p>
          <p>WhatsApp: ${whatsapp}</p>
        `,
      });
      console.log('Resend email send data:', emailData); // Added for debugging
      return NextResponse.json(emailData);
    } catch (resendError) {
      console.error('Resend email send error:', resendError);
      let resendErrorMessage = 'Failed to send email via Resend.';
      if (resendError instanceof Error) {
        resendErrorMessage = `Resend error: ${resendError.message}`;
      } else if (typeof resendError === 'object' && resendError !== null && 'message' in resendError) {
        resendErrorMessage = `Resend error: ${(resendError as any).message}`;
      } else {
        resendErrorMessage = `Resend error: ${String(resendError)}`;
      }
      return NextResponse.json({ error: resendErrorMessage }, { status: 500 });
    }
  } catch (error) {
    console.error('General error in /api/contact:', error);
    let errorMessage = 'Failed to send email.';
    if (error instanceof Error) {
      errorMessage = `Failed to send email: ${error.message}`;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = `Failed to send email: ${(error as any).message}`;
    } else {
      errorMessage = `Failed to send email: ${String(error)}`; // Catch all for non-object errors
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}