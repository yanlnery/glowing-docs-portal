import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordRequirement {
  label: string;
  met: boolean;
}

interface PasswordRequirementsProps {
  password: string;
  show?: boolean;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password, show = true }) => {
  const requirements: PasswordRequirement[] = [
    { label: 'Mínimo de 8 caracteres', met: password.length >= 8 },
    { label: 'Pelo menos 1 letra minúscula', met: /[a-z]/.test(password) },
    { label: 'Pelo menos 1 letra maiúscula', met: /[A-Z]/.test(password) },
    { label: 'Pelo menos 1 número', met: /[0-9]/.test(password) },
    { label: 'Pelo menos 1 caractere especial (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const allMet = requirements.every((req) => req.met);

  if (!show || password.length === 0) return null;

  return (
    <div className="mt-2 p-3 rounded-lg bg-muted/50 border border-border">
      <p className="text-sm font-medium text-foreground mb-2">Sua senha deve conter:</p>
      <ul className="space-y-1.5">
        {requirements.map((req, index) => (
          <li
            key={index}
            className={cn(
              'flex items-center gap-2 text-sm transition-colors duration-200',
              req.met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
            )}
          >
            {req.met ? (
              <Check className="h-4 w-4 shrink-0" />
            ) : (
              <X className="h-4 w-4 shrink-0 text-muted-foreground/50" />
            )}
            <span>{req.label}</span>
          </li>
        ))}
      </ul>
      {allMet && (
        <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
          ✓ Senha segura!
        </p>
      )}
    </div>
  );
};

export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'A senha deve ter pelo menos 8 caracteres.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'A senha deve conter pelo menos 1 letra minúscula.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'A senha deve conter pelo menos 1 letra maiúscula.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'A senha deve conter pelo menos 1 número.' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'A senha deve conter pelo menos 1 caractere especial.' };
  }
  return { valid: true, message: '' };
};

export default PasswordRequirements;
