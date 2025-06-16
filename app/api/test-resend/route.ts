import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json()

    if (!to || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields: to, subject, message" }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_EMAIL || "onboarding@resend.dev",
      to: [to],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🧪 Travel Agency Integration Test</h2>
          <p>This is a test email from your travel agency website to verify that the Resend integration is working correctly.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Test Message:</h3>
            <p>${message}</p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
            <p style="color: #6b7280; font-size: 14px;">
              ✅ If you received this email, your Resend integration is working perfectly!<br>
              🕒 Sent at: ${new Date().toLocaleString()}<br>
              🌐 From: Travel Agency Website
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      id: data?.id,
      to: to,
    })
  } catch (error) {
    console.error("Email test error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to send test email",
      },
      { status: 500 },
    )
  }
}
