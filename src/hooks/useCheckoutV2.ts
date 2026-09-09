import { useEffect, useState } from 'react';
import { settingsService } from '@/services/settingsService';

// Flag do checkout enxuto (PR4). Default false: nada muda para o usuário
// enquanto checkout_v2_enabled estiver false no banco.
// Override local de teste: ?checkout_v2=1 vale só nesta aba (sessionStorage),
// nunca grava no banco e é ignorado nos domínios de produção.
const readLocalOverride = (): boolean | null => {
  if (typeof window === 'undefined') return null;
  const host = window.location.hostname;
  const isProductionHost = /(^|\.)petserpentes\.com(\.br)?$/.test(host);
  if (isProductionHost) return null;

  const param = new URLSearchParams(window.location.search).get('checkout_v2');
  if (param === '1') sessionStorage.setItem('checkout_v2_override', '1');
  if (param === '0') sessionStorage.removeItem('checkout_v2_override');

  return sessionStorage.getItem('checkout_v2_override') === '1' ? true : null;
};

export const useCheckoutV2Enabled = () => {
  const [enabled, setEnabled] = useState(false);


  useEffect(() => {
    let cancelled = false;
    settingsService
      .getSettings(['checkout_v2_enabled'])
      .then(({ data }) => {
        if (!cancelled) setEnabled(data?.checkout_v2_enabled === true);
      })
      .catch(() => {
        if (!cancelled) setEnabled(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return enabled;
};
