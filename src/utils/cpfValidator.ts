/**
 * CPF Validator - Validação completa com dígitos verificadores
 * Usado para emissão de NF, Certificado de Origem e Licença de Transporte (SisFauna/IBAMA)
 */

/**
 * Remove máscara do CPF, retornando apenas dígitos
 */
export const cleanCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};

/**
 * Aplica máscara de CPF: 000.000.000-00
 */
export const formatCPF = (value: string): string => {
  const digits = cleanCPF(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

/**
 * Calcula os dígitos verificadores do CPF
 */
const calculateVerifierDigits = (cpfBase: string): { dv1: number; dv2: number } => {
  // Primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpfBase[i]) * (10 - i);
  }
  let remainder = sum % 11;
  const dv1 = remainder < 2 ? 0 : 11 - remainder;

  // Segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpfBase[i]) * (11 - i);
  }
  sum += dv1 * 2;
  remainder = sum % 11;
  const dv2 = remainder < 2 ? 0 : 11 - remainder;

  return { dv1, dv2 };
};

/**
 * Valida CPF completo com dígitos verificadores
 * @returns true se CPF válido, false se inválido
 */
export const validateCPF = (cpf: string): boolean => {
  const cleaned = cleanCPF(cpf);

  // Deve ter exatamente 11 dígitos
  if (cleaned.length !== 11) {
    return false;
  }

  // Rejeitar CPFs com todos os dígitos iguais
  if (/^(\d)\1+$/.test(cleaned)) {
    return false;
  }

  // Extrair base e dígitos verificadores informados
  const cpfBase = cleaned.slice(0, 9);
  const informedDV1 = parseInt(cleaned[9]);
  const informedDV2 = parseInt(cleaned[10]);

  // Calcular dígitos verificadores
  const { dv1, dv2 } = calculateVerifierDigits(cpfBase);

  // Comparar dígitos calculados com informados
  return dv1 === informedDV1 && dv2 === informedDV2;
};
