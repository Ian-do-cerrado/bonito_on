"use server"

import { Resend } from "resend"
import {
  assertResendConfigured,
  sendLeadEmail,
} from "@/lib/resend-email"

const resend = new Resend(process.env.RESEND_API_KEY)

interface NewsletterData {
  email: string
}

export async function subscribeNewsletter(data: NewsletterData) {
  try {
    assertResendConfigured()

    const { id: emailId } = await sendLeadEmail(resend, {
      subject: `📧 Nova Inscrição Newsletter - ${data.email}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nova Inscrição Newsletter - BonitoON</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e2c1e 0%, #16a34a 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">
                Bonito<span style="color: #4ade80;">ON</span>
              </h1>
              <p style="color: #bbf7d0; margin: 15px 0 0 0; font-size: 18px;">
                📧 Nova Inscrição na Newsletter
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              
              <!-- Newsletter Details -->
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #16a34a; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: #16a34a; margin: 0 0 20px 0; font-size: 18px; font-weight: bold;">
                  📋 Detalhes da Inscrição
                </h3>
                
                <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #16a34a;">
                  <strong style="color: #374151; display: block; margin-bottom: 5px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">📧 E-mail</strong>
                  <span style="color: #1f2937; font-size: 18px; font-weight: 600;">${data.email}</span>
                </div>
                
                <div style="padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #3b82f6;">
                  <strong style="color: #374151; display: block; margin-bottom: 5px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">🕐 Data/Hora</strong>
                  <span style="color: #1f2937; font-size: 16px;">${new Date().toLocaleString("pt-BR", {
                    timeZone: "America/Campo_Grande",
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</span>
                </div>
              </div>

              <!-- Action Plan -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">
                  📝 Próximos Passos
                </h3>
                <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px;">
                  <li style="margin-bottom: 8px;">Adicionar e-mail à lista de newsletter</li>
                  <li style="margin-bottom: 8px;">Enviar e-mail de boas-vindas</li>
                  <li style="margin-bottom: 8px;">Incluir nas campanhas promocionais</li>
                  <li style="margin-bottom: 0;">Segmentar para ofertas especiais</li>
                </ul>
              </div>

              <!-- Stats -->
              <div style="background: #f8fafc; border-radius: 12px; padding: 25px;">
                <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px; text-align: center;">📊 Estatísticas Newsletter</h3>
                
                <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
                  <div style="font-size: 24px; font-weight: bold; color: #16a34a;">+1</div>
                  <div style="font-size: 12px; color: #6b7280;">Novo inscrito na newsletter</div>
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-top: 15px;">
                  <p style="margin: 0; font-size: 13px; color: #374151;">
                    <strong>💡 Dica:</strong> Inscritos na newsletter têm 40% mais chance de se tornarem clientes. 
                    Envie conteúdo relevante e ofertas exclusivas!
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 12px;">
                📧 Email gerado automaticamente pelo sistema BonitoON
              </p>
              <p style="color: #6b7280; margin: 0; font-size: 12px;">
                🌿 <strong>BonitoON</strong> - Transformando sonhos em aventuras desde 2020
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
🌿 NOVA INSCRIÇÃO NEWSLETTER - BonitoON

📧 E-mail: ${data.email}
🕐 Data/Hora: ${new Date().toLocaleString("pt-BR", {
        timeZone: "America/Campo_Grande",
      })}

📝 PRÓXIMOS PASSOS:
- Adicionar e-mail à lista de newsletter
- Enviar e-mail de boas-vindas
- Incluir nas campanhas promocionais
- Segmentar para ofertas especiais

💡 DICA: Inscritos na newsletter têm 40% mais chance de se tornarem clientes!

---
BonitoON - Sua aventura em Bonito começa aqui
Sistema de notificações v2.0
      `,
    })

    console.log("✅ Inscrição na newsletter enviada com sucesso:", {
      success: true,
      emailId,
      email: data.email,
      timestamp: new Date().toISOString(),
    })

    return {
      success: true,
      emailId,
      message: "Inscrição realizada com sucesso! Você receberá nossas novidades em breve.",
    }
  } catch (error) {
    console.error("❌ Erro ao processar inscrição na newsletter:", {
      error: error instanceof Error ? error.message : "Erro desconhecido",
      email: data.email,
      timestamp: new Date().toISOString(),
    })

    return {
      success: false,
      error: "Erro ao processar inscrição. Tente novamente em alguns instantes.",
    }
  }
}
