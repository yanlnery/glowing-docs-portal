// Utilitários de segurança compartilhados entre as Edge Functions.

export const ALLOWED_ORIGIN = "https://petserpentes.com.br";

export const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Vary": "Origin",
};

type Bucket = { count: number; firstAt: number };
const buckets = new Map<string, Bucket>();

/**
 * Rate limit em memória (por instância da função).
 * Retorna { allowed, retryAfter } para a chave informada.
 */
export function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number,
): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now - entry.firstAt > windowMs) {
    buckets.set(key, { count: 1, firstAt: now });
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= maxAttempts) {
    return {
      allowed: false,
      retryAfter: Math.ceil((windowMs - (now - entry.firstAt)) / 1000),
    };
  }

  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

export function tooManyRequests(retryAfter: number): Response {
  return new Response(
    JSON.stringify({
      error: "Muitas tentativas. Aguarde antes de tentar novamente.",
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Retry-After": String(Math.max(1, retryAfter)),
      },
    },
  );
}

export function isValidEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    email.length <= 255 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

/** Verifica se existe um usuário de autenticação com o e-mail informado. */
export async function authUserExists(email: string): Promise<boolean> {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return false;

  const res = await fetch(
    `${url}/auth/v1/admin/users?filter=${encodeURIComponent(email)}&per_page=1`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    },
  );

  if (!res.ok) return false;
  const data = await res.json().catch(() => null);
  const users = data?.users ?? [];
  return users.some(
    (u: { email?: string }) =>
      (u.email ?? "").toLowerCase() === email.toLowerCase(),
  );
}

const lastSentAt = new Map<string, number>();

/** Evita reenvio do mesmo tipo de e-mail para o mesmo endereço em janela curta. */
export function recentlySent(kind: string, email: string, windowMs = 5 * 60_000) {
  const key = `${kind}:${email.toLowerCase()}`;
  const last = lastSentAt.get(key);
  if (last && Date.now() - last < windowMs) {
    return { blocked: true, retryAfter: Math.ceil((windowMs - (Date.now() - last)) / 1000) };
  }
  return { blocked: false, retryAfter: 0 };
}

export function markSent(kind: string, email: string) {
  lastSentAt.set(`${kind}:${email.toLowerCase()}`, Date.now());
}
