import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotifyRequest {
  species_id: string;
  species_name: string;
  message?: string;
}

// Escape HTML to prevent XSS/injection attacks
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');
}

const handler = async (req: Request): Promise<Response> => {
  console.log("notify-waitlist function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // Verify admin authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized: No authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create client with user's token to verify identity
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    
    if (userError || !user) {
      console.error("Failed to get user:", userError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`User authenticated: ${user.id}`);

    // Check if user has admin role using service role client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) {
      console.error("Error checking user role:", roleError);
      return new Response(
        JSON.stringify({ error: "Failed to verify permissions" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!roleData) {
      console.error(`User ${user.id} is not an admin`);
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Admin access verified for user: ${user.id}`);

    const { species_id, species_name, message }: NotifyRequest = await req.json();
    console.log(`Notifying waitlist for species: ${species_name} (${species_id})`);

    // Get all waiting entries for this species
    const { data: waitlistEntries, error: fetchError } = await supabase
      .from("species_waitlist")
      .select("id, name, email, phone, contact_preference")
      .eq("species_id", species_id)
      .eq("status", "waiting");

    if (fetchError) {
      console.error("Error fetching waitlist entries:", fetchError);
      throw new Error(`Failed to fetch waitlist entries: ${fetchError.message}`);
    }

    if (!waitlistEntries || waitlistEntries.length === 0) {
      console.log("No entries found in waitlist for this species");
      return new Response(
        JSON.stringify({ success: true, notified: 0, message: "Nenhum interessado na lista de espera" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${waitlistEntries.length} entries to notify`);

    const emailPromises = waitlistEntries.map(async (entry) => {
      try {
        // Sanitize the custom message to prevent HTML injection
        const defaultMessage = `Temos uma ótima notícia! O animal ${escapeHtml(species_name)} que você demonstrou interesse está disponível para aquisição.`;
        const customMessage = message ? escapeHtml(message) : defaultMessage;
        
        const emailResponse = await resend.emails.send({
          from: "Reptilianos <onboarding@resend.dev>",
          to: [entry.email],
          subject: `🦎 ${species_name} está disponível!`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #2d5a27 0%, #4a7c4e 100%); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">🦎 Reptilianos</h1>
                  <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Criação Responsável de Répteis</p>
                </div>
                
                <div style="padding: 30px;">
                  <h2 style="color: #2d5a27; margin-top: 0;">Olá, ${escapeHtml(entry.name)}!</h2>
                  
                  <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    ${customMessage}
                  </p>
                  
                  <div style="background: #f0f7ef; border-left: 4px solid #2d5a27; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                    <strong style="color: #2d5a27;">Espécie:</strong>
                    <span style="color: #333;">${escapeHtml(species_name)}</span>
                  </div>
                  
                  <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Entre em contato conosco o mais breve possível para garantir o seu!
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://wa.me/5511999999999" style="display: inline-block; background: #25D366; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      💬 Falar no WhatsApp
                    </a>
                  </div>
                  
                  <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    Se você não demonstrou interesse nesta espécie, por favor desconsidere este email.
                  </p>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="color: #666; font-size: 12px; margin: 0;">
                    © 2024 Reptilianos - Criação Responsável de Répteis
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        console.log(`Email sent to ${entry.email}:`, emailResponse);

        // Update entry status to notified
        await supabase
          .from("species_waitlist")
          .update({ 
            status: "notified",
            updated_at: new Date().toISOString()
          })
          .eq("id", entry.id);

        return { success: true, email: entry.email };
      } catch (emailError: any) {
        console.error(`Failed to send email to ${entry.email}:`, emailError);
        return { success: false, email: entry.email, error: emailError.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);

    console.log(`Notification complete: ${successful} sent, ${failed.length} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notified: successful, 
        failed: failed.length,
        failedEmails: failed 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in notify-waitlist function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
