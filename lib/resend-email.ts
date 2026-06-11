/** Shared Resend configuration for lead/notification emails */

import type { Resend } from "resend"

/** Fixed destination for all website leads (do not use CONTACT_EMAIL — it may be stale in older builds). */
export const LEAD_DESTINATION_EMAIL = "atendimento@bonitoon.com.br"

export function getLeadDestinationEmail(): string {
  return LEAD_DESTINATION_EMAIL
}

/** Remetente no domínio verificado (pode sobrescrever com RESEND_FROM_EMAIL). */
export const RESEND_FROM_ADDRESS = "BonitoON <leads@bonitoon.com.br>"

export function getResendFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL ?? RESEND_FROM_ADDRESS
}

export function getReplyToAddress(email?: string): string | undefined {
  const trimmed = email?.trim()
  if (!trimmed) return undefined
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return undefined
  return trimmed
}

type ResendClient = InstanceType<typeof Resend>

export type LeadEmailPayload = {
  subject: string
  html: string
  text?: string
  reply_to?: string
}

/** Sends lead notification to atendimento@bonitoon.com.br via verified domain. */
export async function sendLeadEmail(
  resend: ResendClient,
  payload: LeadEmailPayload,
): Promise<{ id: string; deliveredTo: string }> {
  const deliveredTo = getLeadDestinationEmail()
  const result = await resend.emails.send({
    from: getResendFromAddress(),
    to: [deliveredTo],
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    reply_to: payload.reply_to,
  })

  const id = assertResendSendSucceeded(result)
  return { id, deliveredTo }
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export function assertResendConfigured(): void {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY não configurada")
    throw new Error("Configuração de email não encontrada")
  }
}

type ResendSendResult = {
  data: { id: string } | null
  error: { message: string; name?: string } | null
}

export function assertResendSendSucceeded(result: ResendSendResult): string {
  if (result.error) {
    console.error("Resend API error:", result.error)
    throw new Error(result.error.message || "Falha ao enviar email")
  }
  if (!result.data?.id) {
    throw new Error("Resend não retornou confirmação de envio")
  }
  return result.data.id
}
