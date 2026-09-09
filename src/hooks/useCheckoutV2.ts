import { useEffect, useState } from 'react';
import { settingsService } from '@/services/settingsService';

// Flag do checkout enxuto (PR4). Default false: nada muda para o usuário
// enquanto checkout_v2_enabled estiver false no banco.
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
