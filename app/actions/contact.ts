"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SubmitContactFormData {
  name: string;
  whatsapp: string;
  email: string;
  checkin: string;
  guests: string;
  attraction: string;
}

export async function submitContactForm(data: SubmitContactFormData) {
  try {
    // Validate required environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY não configurada")
      throw new Error("Configuração de email não encontrada")
    }

    // Format WhatsApp number for better readability
    const formattedWhatsApp = data.whatsapp.replace(/\D/g, "")
    const whatsappDisplay =
      formattedWhatsApp.length === 11
        ? `(${formattedWhatsApp.slice(0, 2)}) ${formattedWhatsApp.slice(2, 7)}-${formattedWhatsApp.slice(7)}`
        : data.whatsapp

    // Generate WhatsApp link
    const whatsappLink = `https://wa.me/55${formattedWhatsApp}`
    const phoneLink = `tel:+5567991395384`

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: "BonitoON Website <contato@bonitoon.com.br>",
      to: ["contato@bonitoon.com.br"],
      subject: `🌿 Novo Lead - ${data.name} interessado em Bonito`,
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Novo Contato - BonitoON</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e2c1e 0%, #16a34a 100%); padding: 40px 30px; text-align: center; position: relative;">
              <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; opacity: 0.5;"></div>
              <div style="position: absolute; bottom: -10px; left: -10px; width: 60px; height: 60px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; opacity: 0.3;"></div>
              
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold; position: relative; z-index: 1;">
                Bonito<span style="color: #4ade80;">ON</span>
              </h1>
              <p style="color: #bbf7d0; margin: 15px 0 0 0; font-size: 18px; position: relative; z-index: 1;">
                🎯 Novo Lead Qualificado!
              </p>
            </div>

            <!-- Alert Banner -->
            <div style="background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%); padding: 15px 30px; text-align: center;">
              <p style="margin: 0; color: #92400e; font-weight: bold; font-size: 14px;">
                ⚡ AÇÃO IMEDIATA REQUERIDA - Responder em até 15 minutos para máxima conversão
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              
              <!-- Contact Details Card -->
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #16a34a; border-radius: 12px; padding: 25px; margin-bottom: 30px; position: relative;">
                <div style="position: absolute; top: -10px; left: 20px; background: white; padding: 0 10px; color: #16a34a; font-weight: bold; font-size: 14px;">
                  📋 DADOS DO CLIENTE
                </div>
                
                <div style="margin-top: 10px;">
                  <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #16a34a;">
                    <strong style="color: #374151; display: block; margin-bottom: 5px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">👤 Nome Completo</strong>
                    <span style="color: #1f2937; font-size: 18px; font-weight: 600;">${data.name}</span>
                  </div>
                  
                  <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #25d366;">
                    <strong style="color: #374151; display: block; margin-bottom: 5px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">📱 WhatsApp</strong>
                    <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                      <span style="color: #1f2937; font-size: 18px; font-weight: 600;">${whatsappDisplay}</span>
                      <a href="${whatsappLink}" 
                         style="background: linear-gradient(135deg, #25d366 0%, #128c7e 100%); color: white; padding: 8px 16px; text-decoration: none; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block;">
                        💬 Abrir WhatsApp
                      </a>
                    </div>
                  </div>
                  
                  <div style="padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <strong style="color: #374151; display: block; margin-bottom: 5px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">🕐 Data/Hora</strong>
                    <span style="color: #1f2937; font-size: 16px;">${new Date().toLocaleString("pt-BR", {
                      timeZone: "America/Campo_Grande",
                    })}</span>
                  </div>
                </div>
              </div>

              <!-- Action Plan -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 25px; margin-bottom: 30px; position: relative;">
                <div style="position: absolute; top: -10px; left: 20px; background: white; padding: 0 10px; color: #f59e0b; font-weight: bold; font-size: 14px;">
                  🎯 PLANO DE AÇÃO
                </div>
                
                <div style="margin-top: 15px;">
                  <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">
                    ⚡ Próximos 15 minutos (CRÍTICO):
                  </h3>
                  <ol style="color: #92400e; margin: 0 0 20px 0; padding-left: 20px; font-size: 14px;">
                    <li style="margin-bottom: 8px; font-weight: 600;">Responder via WhatsApp imediatamente</li>
                    <li style="margin-bottom: 8px;">Cumprimentar e agradecer o interesse</li>
                    <li style="margin-bottom: 8px;">Perguntar sobre datas e preferências</li>
                    <li style="margin-bottom: 0;">Agendar conversa telefônica</li>
                  </ol>
                  
                  <h3 style="color: #92400e; margin: 20px 0 15px 0; font-size: 16px; font-weight: bold;">
                    📋 Próximas 2 horas:
                  </h3>
                  <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px;">
                    <li style="margin-bottom: 8px;">Enviar catálogo personalizado</li>
                    <li style="margin-bottom: 8px;">Identificar orçamento e grupo</li>
                    <li style="margin-bottom: 8px;">Propor 3 opções de roteiro</li>
                    <li style="margin-bottom: 0;">Agendar reunião para fechar</li>
                  </ul>
                </div>
              </div>

              <!-- Quick Actions -->
              <div style="text-align: center; margin: 30px 0;">
                <h3 style="color: #1f2937; margin-bottom: 20px; font-size: 18px;">🚀 Ações Rápidas</h3>
                
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                  <a href="${whatsappLink}" 
                     style="background: linear-gradient(135deg, #25d366 0%, #128c7e 100%); color: white; padding: 15px 25px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3); transition: transform 0.2s;">
                    💬 Responder WhatsApp
                  </a>
                  
                  <a href="${phoneLink}" 
                     style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 15px 25px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 15px rgba(22, 163, 74, 0.3);">
                    📞 Ligar Agora
                  </a>
                </div>
              </div>

              <!-- Stats & Tips -->
              <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin-top: 30px;">
                <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px; text-align: center;">📊 Dicas de Conversão</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                  <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold; color: #16a34a;">85%</div>
                    <div style="font-size: 12px; color: #6b7280;">Taxa de conversão respondendo em 15min</div>
                  </div>
                  
                  <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold; color: #dc2626;">23%</div>
                    <div style="font-size: 12px; color: #6b7280;">Taxa após 1 hora sem resposta</div>
                  </div>
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                  <p style="margin: 0; font-size: 13px; color: #374151;">
                    <strong>💡 Dica:</strong> Mencione que viu o interesse pelo site e pergunte sobre as datas desejadas. 
                    Clientes que preenchem formulário têm 3x mais chance de fechar negócio!
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
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; margin: 0; font-size: 11px;">
                  Sistema de notificações v2.0 | Horário de Brasília (GMT-4)
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
      `,
      // Enhanced text version
      text: `
🌿 NOVO LEAD QUALIFICADO - BonitoON

⚡ AÇÃO IMEDIATA REQUERIDA ⚡
Responder em até 15 minutos para máxima conversão!

📋 DADOS DO CLIENTE:
Nome: ${data.name}
WhatsApp: ${whatsappDisplay}
Data/Hora: ${new Date().toLocaleString("pt-BR", {
        timeZone: "America/Campo_Grande",
      })}

🎯 PLANO DE AÇÃO:

Próximos 15 minutos (CRÍTICO):
1. Responder via WhatsApp imediatamente
2. Cumprimentar e agradecer o interesse  
3. Perguntar sobre datas e preferências
4. Agendar conversa telefônica

Próximas 2 horas:
- Enviar catálogo personalizado
- Identificar orçamento e grupo
- Propor 3 opções de roteiro
- Agendar reunião para fechar

🚀 LINKS RÁPIDOS:
WhatsApp: ${whatsappLink}
Telefone: ${phoneLink}

📊 ESTATÍSTICAS:
- 85% conversão respondendo em 15min
- 23% conversão após 1 hora

💡 DICA: Clientes que preenchem formulário têm 3x mais chance de fechar!

---
BonitoON - Sua aventura em Bonito começa aqui
Sistema de notificações v2.0
      `,
    })

    // Enhanced logging for monitoring
    const logData = {
      success: true,
      emailId: emailResult.data?.id,
      to: "contato@bonitoon.com.br",
      contact: {
        name: data.name,
        whatsapp: whatsappDisplay,
        whatsappRaw: formattedWhatsApp,
      },
      timestamp: new Date().toISOString(),
      source: "website_contact_form",
      urgency: "high", // Lead qualificado
    }

    console.log("✅ Email de lead enviado com sucesso:", logData)

    return {
      success: true,
      emailId: emailResult.data?.id,
      message: "Lead enviado com sucesso! Nossa equipe foi notificada.",
    }
  } catch (error) {
    // Enhanced error logging
    console.error("❌ Erro ao enviar email de lead:", {
      error: error instanceof Error ? error.message : "Erro desconhecido",
      stack: error instanceof Error ? error.stack : undefined,
      contact: data.name,
      timestamp: new Date().toISOString(),
    })

    // Return specific error messages
    if (error instanceof Error) {
      if (error.message.includes("API_KEY") || error.message.includes("Unauthorized")) {
        return {
          success: false,
          error: "Configuração de email não encontrada. Nossa equipe foi notificada do problema.",
        }
      }
      if (error.message.includes("rate limit") || error.message.includes("429")) {
        return {
          success: false,
          error: "Muitas tentativas. Tente novamente em alguns minutos ou ligue diretamente.",
        }
      }
      if (error.message.includes("network") || error.message.includes("timeout")) {
        return {
          success: false,
          error: "Problema de conexão. Verifique sua internet e tente novamente.",
        }
      }
    }

    return {
      success: false,
      error: "Erro temporário no sistema. Tente novamente ou entre em contato diretamente pelo WhatsApp.",
    }
  }
}
