/**
 * Serviço de busca de endereço via ViaCEP
 * https://viacep.com.br/
 */

export interface ViaCepAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface AddressData {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}

/**
 * Limpa CEP removendo caracteres não numéricos
 */
export const cleanCEP = (cep: string): string => {
  return cep.replace(/\D/g, '');
};

/**
 * Aplica máscara de CEP: 00000-000
 */
export const formatCEP = (value: string): string => {
  const digits = cleanCEP(value).slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, '$1-$2');
};

/**
 * Busca endereço pelo CEP na API ViaCEP
 * @param cep CEP com ou sem máscara
 * @returns Dados do endereço ou null se não encontrado/erro
 */
export const fetchAddressByCep = async (cep: string): Promise<AddressData | null> => {
  const cleanedCep = cleanCEP(cep);

  // Verificar se tem 8 dígitos
  if (cleanedCep.length !== 8) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(
      `https://viacep.com.br/ws/${cleanedCep}/json/`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const data: ViaCepAddress = await response.json();

    // ViaCEP retorna { erro: true } quando CEP não existe
    if (data.erro) {
      return null;
    }

    return {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      uf: data.uf || ''
    };
  } catch (error) {
    // Timeout, network error, etc.
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
};
