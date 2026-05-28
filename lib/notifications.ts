import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendClaimNotification(params: {
  to: string
  subject: string
  name: string
  claimText: string
  poster: string
  profileUrl: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[DEV] Would send email:", params)
    return { success: true, dev: true }
  }

  try {
    await resend.emails.send({
      from: "PsDiary <alerts@psdiary.app>",
      to: params.to,
      subject: params.subject,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto;">
          <h2 style="color: #0B2545;">New claim on ${params.name}</h2>
          <p style="color: #334155; font-size: 15px;">${params.claimText}</p>
          <p style="font-size: 13px; color: #64748b;">Posted by ${params.poster}</p>
          
          <a href="${params.profileUrl}" 
             style="display:inline-block; background:#0B2545; color:white; padding:10px 20px; border-radius:12px; text-decoration:none; margin-top:12px;">
            View full profile &amp; vote →
          </a>

          <p style="margin-top: 32px; font-size: 12px; color:#94a3b8;">
            You received this because you claimed or are watching this name on PsDiary.
          </p>
        </div>
      `
    })
    return { success: true }
  } catch (error) {
    console.error("Email failed:", error)
    return { success: false, error }
  }
}
