import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

interface PasswordResetRequest {
  email: string;
  resetUrl: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetUrl, name }: PasswordResetRequest = await req.json();
    
    // Sanitize user input to prevent XSS
    const safeName = escapeHtml(name || 'Criador');

    const emailResponse = await resend.emails.send({
      from: "Pet Serpentes <noreply@send.petserpentes.com.br>",
      to: [email],
      subject: "Redefinição de senha - Pet Serpentes",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; background-color: #1a1a2e; border-radius: 8px 8px 0 0;">
                      <img src="https://xlhcneenthhhsjqqdmbm.supabase.co/storage/v1/object/public/carousel_images_bucket/logo-petserpentes.png" alt="Pet Serpentes" style="width: 80px; height: 80px; border-radius: 50%;">
                      <h1 style="color: #ffffff; margin: 20px 0 0; font-size: 24px;">Pet Serpentes</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #1a1a2e; margin: 0 0 20px; font-size: 22px;">Olá, ${safeName}!</h2>
                      <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                        Recebemos uma solicitação para redefinir a senha da sua conta na Pet Serpentes.
                      </p>
                      <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                        Clique no botão abaixo para criar uma nova senha:
                      </p>
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center">
                            <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background-color: #f59e0b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 8px;">
                              Redefinir minha senha
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="color: #888888; font-size: 14px; line-height: 1.6; margin: 30px 0 0;">
                        Este link expira em 1 hora por motivos de segurança.
                      </p>
                      <p style="color: #888888; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
                        Se você não solicitou a redefinição de senha, pode ignorar este e-mail. Sua senha permanecerá inalterada.
                      </p>
                      <p style="color: #888888; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
                        Se o botão não funcionar, copie e cole este link no seu navegador:
                        <br>
                        <a href="${resetUrl}" style="color: #f59e0b; word-break: break-all;">${resetUrl}</a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 40px; background-color: #f8f8f8; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="color: #888888; font-size: 12px; margin: 0;">
                        © 2024 Pet Serpentes. Todos os direitos reservados.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
