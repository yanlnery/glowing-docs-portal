import { supabase } from "@/integrations/supabase/client";
import type { SystemSetting } from "@/types/order";

export const settingsService = {
  // Buscar todas as configurações
  async getAllSettings(): Promise<{ data: SystemSetting[] | null; error: any }> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('key');
    
    return { data, error };
  },

  // Buscar configuração por chave
  async getSettingByKey(key: string): Promise<{ data: SystemSetting | null; error: any }> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('key', key)
      .single();
    
    return { data, error };
  },

  // Atualizar configuração
  async updateSetting(key: string, value: any): Promise<{ data: SystemSetting | null; error: any }> {
    const { data, error } = await supabase
      .from('system_settings')
      .upsert({ 
        key, 
        value: typeof value === 'string' ? value : JSON.stringify(value),
        updated_at: new Date().toISOString() 
      })
      .select('*')
      .single();
    
    return { data, error };
  },

  // Buscar múltiplas configurações
  async getSettings(keys: string[]): Promise<{ data: Record<string, any>; error: any }> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value')
      .in('key', keys);
    
    if (error) return { data: {}, error };

    const settings: Record<string, any> = {};
    data.forEach(setting => {
      try {
        settings[setting.key] = typeof setting.value === 'string' 
          ? JSON.parse(setting.value) 
          : setting.value;
      } catch {
        settings[setting.key] = setting.value;
      }
    });

    return { data: settings, error: null };
  }
};