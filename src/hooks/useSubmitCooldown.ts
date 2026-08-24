import { useCallback, useEffect, useState } from 'react';

/**
 * Rate limiting client-side para formulários públicos.
 * Guarda o timestamp do último envio bem-sucedido em sessionStorage
 * e expõe o tempo restante de cooldown (em segundos).
 */
export function useSubmitCooldown(formKey: string, cooldownSeconds = 60) {
  const storageKey = `form_cooldown_${formKey}`;

  const readRemaining = useCallback(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) return 0;
      const last = Number(raw);
      if (!Number.isFinite(last)) return 0;
      const elapsed = (Date.now() - last) / 1000;
      return Math.max(0, Math.ceil(cooldownSeconds - elapsed));
    } catch {
      return 0;
    }
  }, [storageKey, cooldownSeconds]);

  const [remaining, setRemaining] = useState<number>(() => readRemaining());

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining(readRemaining()), 1000);
    return () => clearInterval(id);
  }, [remaining, readRemaining]);

  const startCooldown = useCallback(() => {
    try {
      sessionStorage.setItem(storageKey, String(Date.now()));
    } catch {
      /* sessionStorage indisponível */
    }
    setRemaining(cooldownSeconds);
  }, [storageKey, cooldownSeconds]);

  return { remaining, isCoolingDown: remaining > 0, startCooldown };
}
